import { deleteImageFile, saveImagePermanently } from '@/constants/file-system';
import { OnboardingMeal } from '@/constants/seed-data';
import { Category, CookLog, FoodItem, HabitSettings, LanguageCode } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LANGUAGE_KEY = '@what_to_cook_language';
const THEME_KEY = '@what_to_cook_theme';
const HABIT_KEY = '@what_to_cook_habit_settings';
const ONBOARDING_KEY = '@what_to_cook_onboarding';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DEFAULT_HABITS: HabitSettings = {
  breakfast: { start: '07:00', end: '10:00' },
  lunch: { start: '12:00', end: '15:00' },
  dinner: { start: '19:00', end: '22:00' },
};

type ThemeMode = 'light' | 'dark';

interface DataContextType {
  items: FoodItem[];
  cookLogs: CookLog[];
  loading: boolean;
  language: LanguageCode;
  themeMode: ThemeMode;
  habitSettings: HabitSettings;
  hasCompletedOnboarding: boolean;
  addItem: (item: Omit<FoodItem, 'id' | 'createdAt' | 'cookCount'>, options?: { forceNew?: boolean }) => Promise<void>;
  updateItem: (item: FoodItem) => Promise<boolean>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => FoodItem | undefined;
  checkTitleExists: (title: string) => FoodItem | undefined;
  logExistingCook: (id: string) => Promise<void>;
  getRecommendedItems: () => FoodItem[];
  searchByTags: (tags: string[]) => FoodItem[];
  searchByText: (query: string) => FoodItem[];
  filterByCategory: (category: Category | null) => FoodItem[];
  getAllTags: () => string[];
  setLanguage: (lang: LanguageCode) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setHabitSettings: (settings: HabitSettings) => Promise<void>;
  importData: (jsonData: string) => Promise<void>;
  exportData: () => string;
  completeOnboarding: () => Promise<void>;
  addOnboardingMeals: (meals: OnboardingMeal[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const db = SQLite.openDatabaseSync('whattocook.db');

const normalizeTitle = (title: string) => {
  return title.normalize('NFC').trim().toLowerCase();
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [cookLogs, setCookLogs] = useState<CookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [habitSettings, setHabitSettingsState] = useState<HabitSettings>(DEFAULT_HABITS);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true); // default true to avoid flash

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    setupNotifications();
  }, []);

  useEffect(() => {
    initDB();
    loadData();
  }, []);

  const initDB = () => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        imageUri TEXT,
        tags TEXT,
        category TEXT,
        createdAt TEXT,
        cookCount INTEGER DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS cook_logs (
        id TEXT PRIMARY KEY,
        recipeId TEXT,
        recipeTitle TEXT,
        cookedAt TEXT
      );
    `);

    // Migration: Check if cookCount exists, if not add it
    try {
      db.execSync("ALTER TABLE recipes ADD COLUMN cookCount INTEGER DEFAULT 1;");
    } catch (e) {
      // Column already exists, ignore
    }
  };

  const loadFromDB = useCallback(() => {
    const allRows = db.getAllSync<any>('SELECT * FROM recipes ORDER BY createdAt DESC');
    const parsedItems: FoodItem[] = allRows.map((row) => {
      let categories: Category[] = ['Dinner'];
      if (row.category) {
        try {
          const parsed = JSON.parse(row.category);
          categories = Array.isArray(parsed) ? parsed : [row.category as Category];
        } catch {
          categories = [row.category as Category];
        }
      }

      return {
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : [],
        categories,
        cookCount: row.cookCount || 1,
      };
    });
    setItems(parsedItems);

    const logRows = db.getAllSync<any>('SELECT * FROM cook_logs ORDER BY cookedAt DESC');
    setCookLogs(logRows);

    return { parsedItems, logRows };
  }, []);

  const loadData = async () => {
    try {
      const [storedLang, storedTheme, storedHabits, onboardingDone] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_KEY),
        AsyncStorage.getItem(THEME_KEY),
        AsyncStorage.getItem(HABIT_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);

      if (storedLang) setLanguageState(storedLang as LanguageCode);
      if (storedTheme) setThemeModeState(storedTheme as ThemeMode);
      if (storedHabits) setHabitSettingsState(JSON.parse(storedHabits));
      setHasCompletedOnboarding(onboardingDone === 'true');

      const { parsedItems: existingItems } = loadFromDB();

      // Migration: ensure every recipe has at least one cook log entry
      const logs = db.getAllSync<any>('SELECT * FROM cook_logs');
      if (logs.length === 0 && existingItems.length > 0) {
        existingItems.forEach(item => {
          db.runSync(
            'INSERT INTO cook_logs (id, recipeId, recipeTitle, cookedAt) VALUES (?, ?, ?, ?)',
            [Crypto.randomUUID(), item.id, item.title, item.createdAt]
          );
        });
        loadFromDB();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = useCallback(async (item: Omit<FoodItem, 'id' | 'createdAt' | 'cookCount'>, options?: { forceNew?: boolean }) => {
    const createdAt = new Date().toISOString();
    const normalizedTitle = normalizeTitle(item.title);

    // Save image permanently if it's a local file
    const permanentUri = item.imageUri ? await saveImagePermanently(item.imageUri) : null;

    if (!options?.forceNew) {
      const allRecipes = db.getAllSync<{ id: string, title: string, cookCount: number, imageUri: string }>('SELECT id, title, cookCount, imageUri FROM recipes');
      const existing = allRecipes.find(r => normalizeTitle(r.title) === normalizedTitle);

      if (existing) {
        // Increment cookCount and update metadata (LEGACY SILENT MERGE - keeping for safety but interactive form will handle most cases)
        const newCookCount = (existing.cookCount || 1) + 1;

        if (permanentUri && existing.imageUri && existing.imageUri !== permanentUri) {
          await deleteImageFile(existing.imageUri);
        }

        db.runSync(
          'UPDATE recipes SET cookCount = ?, description = ?, imageUri = ?, tags = ?, category = ?, createdAt = ? WHERE id = ?',
          [newCookCount, item.description || '', permanentUri || existing.imageUri, JSON.stringify(item.tags), JSON.stringify(item.categories), createdAt, existing.id]
        );
        db.runSync(
          'INSERT INTO cook_logs (id, recipeId, recipeTitle, cookedAt) VALUES (?, ?, ?, ?)',
          [Crypto.randomUUID(), existing.id, item.title.trim(), createdAt]
        );
        loadFromDB();
        return;
      }
    }

    // Default: Create new
    const id = Crypto.randomUUID();
    db.runSync(
      'INSERT INTO recipes (id, title, description, imageUri, tags, category, createdAt, cookCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, item.title.trim(), item.description, permanentUri, JSON.stringify(item.tags), JSON.stringify(item.categories), createdAt, 1]
    );
    db.runSync(
      'INSERT INTO cook_logs (id, recipeId, recipeTitle, cookedAt) VALUES (?, ?, ?, ?)',
      [Crypto.randomUUID(), id, item.title.trim(), createdAt]
    );
    loadFromDB();
  }, [loadFromDB]);

  const checkTitleExists = useCallback((title: string): FoodItem | undefined => {
    const normalizedTarget = normalizeTitle(title);
    return items.find(item => normalizeTitle(item.title) === normalizedTarget);
  }, [items]);

  const logExistingCook = useCallback(async (id: string) => {
    const existing = items.find(i => i.id === id);
    if (!existing) return;

    const createdAt = new Date().toISOString();
    const newCookCount = (existing.cookCount || 1) + 1;

    db.runSync(
      'UPDATE recipes SET cookCount = ?, createdAt = ? WHERE id = ?',
      [newCookCount, createdAt, existing.id]
    );
    db.runSync(
      'INSERT INTO cook_logs (id, recipeId, recipeTitle, cookedAt) VALUES (?, ?, ?, ?)',
      [Crypto.randomUUID(), existing.id, existing.title, createdAt]
    );
    loadFromDB();
  }, [items, loadFromDB]);

  const updateItem = useCallback(async (updatedItem: FoodItem) => {
    // Check for duplicate title (excluding current item)
    const normalizedTitle = normalizeTitle(updatedItem.title);
    const allRecipes = db.getAllSync<{ id: string, title: string }>('SELECT id, title FROM recipes WHERE id != ?', [updatedItem.id]);
    const duplicate = allRecipes.find(r => normalizeTitle(r.title) === normalizedTitle);

    if (duplicate) {
      return false;
    }

    // Check if the image has changed
    const existing = db.getFirstSync<{ imageUri: string }>('SELECT imageUri FROM recipes WHERE id = ?', [updatedItem.id]);

    let finalImageUri = updatedItem.imageUri;
    if (existing && existing.imageUri !== updatedItem.imageUri) {
      // Delete old image file
      if (existing.imageUri) {
        await deleteImageFile(existing.imageUri);
      }
      // Save new image permanently
      if (updatedItem.imageUri) {
        finalImageUri = await saveImagePermanently(updatedItem.imageUri);
      }
    }

    db.runSync(
      'UPDATE recipes SET title = ?, description = ?, imageUri = ?, tags = ?, category = ? WHERE id = ?',
      [updatedItem.title.trim(), updatedItem.description, finalImageUri, JSON.stringify(updatedItem.tags), JSON.stringify(updatedItem.categories), updatedItem.id]
    );
    loadFromDB();
    return true;
  }, [loadFromDB]);

  const deleteItem = useCallback(async (id: string) => {
    // Delete image file first
    const existing = db.getFirstSync<{ imageUri: string }>('SELECT imageUri FROM recipes WHERE id = ?', [id]);
    if (existing && existing.imageUri) {
      await deleteImageFile(existing.imageUri);
    }

    db.runSync('DELETE FROM recipes WHERE id = ?', [id]);
    loadFromDB();
  }, [loadFromDB]);

  const getItemById = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  const getRecommendedItems = useCallback(() => {
    if (items.length === 0) return [];

    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Determine current category based on habits
    let activeCategory: Category | null = null;
    if (currentTimeStr >= habitSettings.breakfast.start && currentTimeStr <= habitSettings.breakfast.end) activeCategory = 'Breakfast';
    else if (currentTimeStr >= habitSettings.lunch.start && currentTimeStr <= habitSettings.lunch.end) activeCategory = 'Lunch';
    else if (currentTimeStr >= habitSettings.dinner.start && currentTimeStr <= habitSettings.dinner.end) activeCategory = 'Dinner';

    // Scoring logic
    const scoredItems = items.map(item => {
      let score = 0;

      // 1. Matches active category
      if (activeCategory && item.categories.includes(activeCategory)) score += 50;

      // 2. Not cooked recently (based on cookCount and createdAt)
      // High cookCount penalizes score
      score -= (item.cookCount || 1) * 5;

      // 3. Random factor
      score += Math.random() * 20;

      return { item, score };
    });

    return scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(entry => entry.item);
  }, [items, habitSettings]);

  const scheduleWeeklyNotification = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (items.length === 0) return;

    // Pick a random recommendation window
    const baseRecs = getRecommendedItems();
    if (baseRecs.length === 0) return;

    const randomItem = baseRecs[Math.floor(Math.random() * baseRecs.length)];

    // Schedule for 1 hour into the next dinner window
    const [hours, mins] = habitSettings.dinner.start.split(':').map(Number);
    const trigger = new Date();
    trigger.setHours(hours + 1, mins, 0, 0);
    if (trigger < new Date()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "What's for dinner tonight?",
        body: `How about some ${randomItem.title}?`,
        data: { recipeId: randomItem.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });
  }, [items, habitSettings, getRecommendedItems]);

  useEffect(() => {
    if (!loading && items.length > 0) {
      scheduleWeeklyNotification();
    }
  }, [items.length, loading, scheduleWeeklyNotification]);

  const searchByTags = useCallback((tags: string[]) => {
    if (tags.length === 0) return items;
    return items.filter(item =>
      tags.some(tag =>
        item.tags.some(itemTag =>
          itemTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }, [items]);

  const searchByText = useCallback((query: string) => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [items]);

  const filterByCategory = useCallback((category: Category | null) => {
    if (!category) return items;
    return items.filter(item => item.categories.includes(category));
  }, [items]);

  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    items.forEach(item => item.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [items]);

  const setLanguage = useCallback(async (lang: LanguageCode) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  const setHabitSettings = useCallback(async (settings: HabitSettings) => {
    setHabitSettingsState(settings);
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(settings));
  }, []);

  const completeOnboarding = useCallback(async () => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);

  const addOnboardingMeals = useCallback(async (meals: OnboardingMeal[]) => {
    const now = new Date().toISOString();
    for (const meal of meals) {
      const id = Crypto.randomUUID();
      db.runSync(
        'INSERT INTO recipes (id, title, description, imageUri, tags, category, createdAt, cookCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, meal.title, meal.description, null, JSON.stringify(meal.tags), JSON.stringify(meal.categories), now, 1]
      );
      db.runSync(
        'INSERT INTO cook_logs (id, recipeId, recipeTitle, cookedAt) VALUES (?, ?, ?, ?)',
        [Crypto.randomUUID(), id, meal.title, now]
      );
    }
    loadFromDB();
  }, [loadFromDB]);

  const importData = useCallback(async (jsonData: string) => {
    const parsed = JSON.parse(jsonData);
    const dataToImport = Array.isArray(parsed) ? parsed : (parsed.items || []);

    db.execSync('BEGIN TRANSACTION');
    try {
      for (const item of dataToImport) {
        // If item exists, update it, otherwise insert
        const existing = db.getFirstSync('SELECT id FROM recipes WHERE id = ?', [item.id]);
        if (existing) {
          db.runSync(
            'UPDATE recipes SET title = ?, description = ?, imageUri = ?, tags = ?, category = ?, createdAt = ? WHERE id = ?',
            [item.title, item.description, item.imageUri, JSON.stringify(item.tags || []), JSON.stringify(item.categories || [item.category]), item.createdAt, item.id]
          );
        } else {
          db.runSync(
            'INSERT INTO recipes (id, title, description, imageUri, tags, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [item.id, item.title, item.description, item.imageUri, JSON.stringify(item.tags || []), JSON.stringify(item.categories || [item.category]), item.createdAt]
          );
        }
      }
      db.execSync('COMMIT');
    } catch (e) {
      db.execSync('ROLLBACK');
      console.error('Import Error:', e);
      throw e;
    }
    loadFromDB();
  }, [loadFromDB]);

  const exportData = useCallback(() => {
    return JSON.stringify({ items, exportedAt: new Date().toISOString() }, null, 2);
  }, [items]);

  const value = useMemo(() => ({
    items,
    cookLogs,
    loading,
    language,
    themeMode,
    habitSettings,
    hasCompletedOnboarding,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    checkTitleExists,
    logExistingCook,
    getRecommendedItems,
    searchByTags,
    searchByText,
    filterByCategory,
    getAllTags,
    setLanguage,
    setThemeMode,
    setHabitSettings,
    importData,
    exportData,
    completeOnboarding,
    addOnboardingMeals,
  }), [items, cookLogs, loading, language, themeMode, habitSettings, hasCompletedOnboarding, addItem, updateItem, deleteItem, getItemById, getRecommendedItems, searchByTags, searchByText, filterByCategory, getAllTags, setLanguage, setThemeMode, setHabitSettings, importData, exportData, completeOnboarding, addOnboardingMeals]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
