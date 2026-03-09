import { CategorySection } from '@/components/CategorySection';
import { ThemedText } from '@/components/themed-text';
import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { CATEGORIES, FoodItem } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const router = useRouter();
  const { items, language } = useData();
  const [shuffledItems, setShuffledItems] = useState<FoodItem[]>([]);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Shuffle logic
  const shuffle = (array: FoodItem[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    if (items.length > 0) {
      setShuffledItems(shuffle(items));
    }
  }, [items]);

  const itemsByCategory = useMemo(() => {
    const map: Record<string, FoodItem[]> = {};
    CATEGORIES.forEach(cat => map[cat] = []);
    shuffledItems.forEach(item => {
      item.categories.forEach(cat => {
        if (map[cat]) {
          map[cat].push(item);
        }
      });
    });
    return map;
  }, [shuffledItems]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="restaurant" size={26} color={AppColors.primary} />
            <ThemedText style={styles.appTitle} type="subtitle">What to Cook</ThemedText>
          </View>
          <Pressable
            style={styles.fab}
            onPress={() => router.push('/item-form')}
          >
            <Ionicons name="add" size={28} color={AppColors.white} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {CATEGORIES.map((category) => (
            <CategorySection
              key={category}
              category={category}
              items={itemsByCategory[category] || []}
            />
          ))}

          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={60} color={AppColors.primaryLight} />
              <ThemedText style={styles.emptyTitle}>{t('noItemsYet', language)}</ThemedText>
              <ThemedText style={styles.emptySubtitle}>{t('addFirstItem', language)}</ThemedText>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    opacity: 0.7,
  },
});
