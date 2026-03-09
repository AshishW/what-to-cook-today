import { getCategoryTranslation } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useData } from '@/store/data-store';
import { Category, FoodItem } from '@/types/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FoodCard } from './FoodCard';

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
            <Text style={styles.sectionTitle}>{translatedCategory}</Text>
            <FlatList
                data={data}
                renderItem={renderItem as any}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToInterval={styles.cardWidthWrapper.width + 12} // CARD_WIDTH + gap
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
        color: AppColors.textLight,
        letterSpacing: 1.2,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    // We need this for snapToInterval calculation if we want it to be precise
    // but we can just use the value from FoodCard if it were exported.
    // For now I'll just use the padding/gap logic.
    cardWidthWrapper: {
        width: 160, // This is just a helper, actual width is in FoodCard
    }
});
