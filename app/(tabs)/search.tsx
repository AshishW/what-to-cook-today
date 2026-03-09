import { FoodCard } from '@/components/FoodCard';
import { TagChip } from '@/components/TagChip';
import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useData } from '@/store/data-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const { items, getAllTags, language } = useData();
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const allTags = useMemo(() => getAllTags(), [getAllTags]);

    const displayedTags = useMemo(() => {
        if (!query.trim()) return allTags;
        const q = query.toLowerCase();
        return allTags.filter(tag =>
            selectedTags.includes(tag) || tag.toLowerCase().includes(q)
        );
    }, [allTags, query, selectedTags]);

    const results = useMemo(() => {
        let filtered = items;

        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.tags.some(tag => tag.toLowerCase().includes(q))
            );
        }

        if (selectedTags.length > 0) {
            filtered = filtered.filter(item =>
                selectedTags.some(tag =>
                    item.tags.some(itemTag => itemTag.toLowerCase() === tag.toLowerCase())
                )
            );
        }

        return filtered;
    }, [items, query, selectedTags]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={AppColors.textLight} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('searchPlaceholder', language)}
                        placeholderTextColor={AppColors.textMuted}
                        value={query}
                        onChangeText={setQuery}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={20} color={AppColors.textLight} />
                        </Pressable>
                    )}
                </View>
            </View>

            <FlatList
                data={results}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <>
                        {/* Tag Filters */}
                        {allTags.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{t('filterByTags', language)}</Text>
                                <View style={styles.tagCloud}>
                                    {displayedTags.map((tag, idx) => (
                                        <TagChip
                                            key={tag}
                                            label={tag}
                                            index={idx}
                                            selected={selectedTags.includes(tag)}
                                            onPress={() => toggleTag(tag)}
                                            size="small"
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Results header */}
                        <View style={styles.resultHeader}>
                            <Text style={styles.sectionTitle}>{t('searchResults', language)}</Text>
                            <Text style={styles.resultCount}>{results.length}</Text>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <FoodCard
                        item={item}
                        onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={48} color={AppColors.textMuted} />
                        <Text style={styles.emptyText}>{t('noResults', language)}</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.white,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: AppColors.text,
    },
    section: {
        paddingHorizontal: 4,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: AppColors.text,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    tagCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 12,
    },
    resultCount: {
        fontSize: 13,
        color: AppColors.textLight,
        fontWeight: '600',
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 15,
        color: AppColors.textMuted,
        marginTop: 12,
    },
});
