import { deleteImageFile, saveImagePermanently } from '@/constants/file-system';
import { SEED_DATA } from '@/constants/seed-data';
import { Category, FoodItem, LanguageCode } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LANGUAGE_KEY = '@what_to_cook_language';
const THEME_KEY = '@what_to_cook_theme';
const SEEDED_KEY = '@what_to_cook_seeded_sqlite'; // updated key to re-seed

type ThemeMode = 'light' | 'dark';

interface DataContextType {
  items: FoodItem[];
  loading: boolean;
  language: LanguageCode;
  themeMode: ThemeMode;
  addItem: (item: Omit<FoodItem, 'id' | 'createdAt'>) => Promise<void>;
  updateItem: (item: FoodItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => FoodItem | undefined;
  searchByTags: (tags: string[]) => FoodItem[];
  searchByText: (query: string) => FoodItem[];
  filterByCategory: (category: Category | null) => FoodItem[];
  getAllTags: () => string[];
  setLanguage: (lang: LanguageCode) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  importData: (jsonData: string) => Promise<void>;
  exportData: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const db = SQLite.openDatabaseSync('whattocook.db');

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

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
        createdAt TEXT
      );
    `);
  };

  const loadFromDB = useCallback(() => {
    const allRows = db.getAllSync<any>('SELECT * FROM recipes ORDER BY createdAt DESC');
    const parsedItems: FoodItem[] = allRows.map((row) => {
      // Migration logic: handles legacy single string or JSON array
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
      };
    });
    setItems(parsedItems);
    return parsedItems;
  }, []);

  const loadData = async () => {
    try {
      const [storedLang, storedTheme, seeded] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_KEY),
        AsyncStorage.getItem(THEME_KEY),
        AsyncStorage.getItem(SEEDED_KEY),
      ]);

      if (storedLang) setLanguageState(storedLang as LanguageCode);
      if (storedTheme) setThemeModeState(storedTheme as ThemeMode);

      const existingItems = loadFromDB();

      if (existingItems.length === 0 && !seeded) {
        // First launch — seed with sample data
        for (const item of SEED_DATA) {
          db.runSync(
            'INSERT INTO recipes (id, title, description, imageUri, tags, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [item.id, item.title, item.description, item.imageUri, JSON.stringify(item.tags), JSON.stringify(item.categories), item.createdAt]
          );
        }
        await AsyncStorage.setItem(SEEDED_KEY, 'true');
        loadFromDB();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = useCallback(async (item: Omit<FoodItem, 'id' | 'createdAt'>) => {
    const id = Crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Save image permanently if it's a local file
    const permanentUri = item.imageUri ? await saveImagePermanently(item.imageUri) : null;

    db.runSync(
      'INSERT INTO recipes (id, title, description, imageUri, tags, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, item.title, item.description, permanentUri, JSON.stringify(item.tags), JSON.stringify(item.categories), createdAt]
    );
    loadFromDB();
  }, [loadFromDB]);

  const updateItem = useCallback(async (updatedItem: FoodItem) => {
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
      [updatedItem.title, updatedItem.description, finalImageUri, JSON.stringify(updatedItem.tags), JSON.stringify(updatedItem.categories), updatedItem.id]
    );
    loadFromDB();
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
    loading,
    language,
    themeMode,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    searchByTags,
    searchByText,
    filterByCategory,
    getAllTags,
    setLanguage,
    setThemeMode,
    importData,
    exportData,
  }), [items, loading, language, themeMode, addItem, updateItem, deleteItem, getItemById, searchByTags, searchByText, filterByCategory, getAllTags, setLanguage, setThemeMode, importData, exportData]);

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
