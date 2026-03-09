import { getCategoryTranslation, t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useData } from '@/store/data-store';
import { CATEGORIES, Category } from '@/types/types';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface CategoryCarouselProps {
    selectedCategory: Category | null;
    onSelect: (category: Category | null) => void;
}

export function CategoryCarousel({ selectedCategory, onSelect }: CategoryCarouselProps) {
    const { language } = useData();

    const allLabel = t('allCategories', language);

    const data: { key: string; label: string; value: Category | null }[] = [
        { key: 'all', label: allLabel, value: null },
        ...CATEGORIES.map(cat => ({
            key: cat,
            label: getCategoryTranslation(cat, language),
            value: cat,
        })),
    ];

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={item => item.key}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                    const isActive = selectedCategory === item.value;
                    return (
                        <Pressable
                            onPress={() => onSelect(item.value)}
                            style={[
                                styles.pill,
                                isActive && styles.pillActive,
                            ]}
                        >
                            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    list: {
        paddingHorizontal: 16,
        gap: 8,
    },
    pill: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: AppColors.white,
        borderWidth: 1.5,
        borderColor: AppColors.border,
        marginRight: 4,
    },
    pillActive: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textLight,
    },
    pillTextActive: {
        color: AppColors.white,
    },
});
