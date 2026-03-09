import { getCategoryTranslation } from '@/constants/i18n';
import { useData } from '@/store/data-store';
import { Category, FoodItem } from '@/types/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FoodCard } from './FoodCard';
import { ThemedText } from './themed-text';

interface CategorySectionProps {
    category: Category;
    items: FoodItem[];
}

export function CategorySection({ category, items }: CategorySectionProps) {
    const { language } = useData();
    const router = useRouter();

    const translatedCategory = getCategoryTranslation(category, language).toUpperCase();

    const renderItem = ({ item }: { item: FoodItem | { id: string; category: Category } }) => {
        const isPlaceholder = 'category' in item && !('title' in item);

        return (
            <FoodCard
                item={item as FoodItem}
                isPlaceholder={isPlaceholder}
                onPress={() => {
                    if (isPlaceholder) {
                        router.push({
                            pathname: '/item-form',
                            params: { category: category }
                        });
                    } else {
                        router.push({
                            pathname: '/item-detail',
                            params: { id: (item as FoodItem).id }
                        });
                    }
                }}
            />
        );
    };

    // If items is empty, we show one placeholder card
    const data = items.length > 0 ? items : [{ id: `empty-${category}`, category }];

    return (
        <View style={styles.container}>
            <ThemedText style={styles.sectionTitle}>{translatedCategory}</ThemedText>
            <FlatList
                data={data as any}
                renderItem={renderItem as any}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToInterval={160 + 12} // Approximate width, fixed in FoodCard or exportable
                decelerationRate="fast"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 1.2,
        paddingHorizontal: 20,
        marginBottom: 12,
        opacity: 0.6,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
});
