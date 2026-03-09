import { FoodCard } from '@/components/FoodCard';
import { TagChip } from '@/components/TagChip';
import { ThemedText } from '@/components/themed-text';
import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const { items, getAllTags, language } = useData();
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const border = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');

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
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <View style={[styles.searchBar, { backgroundColor: cardColor, borderColor: border }]}>
                    <Ionicons name="search" size={20} color={AppColors.textMuted} />
                    <TextInput
                        style={[styles.searchInput, { color: textColor }]}
                        placeholder={t('searchPlaceholder', language)}
                        placeholderTextColor={AppColors.textMuted}
                        value={query}
                        onChangeText={setQuery}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={20} color={AppColors.textMuted} />
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
                                <ThemedText style={styles.sectionTitle}>{t('filterByTags', language)}</ThemedText>
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
                            <ThemedText style={styles.sectionTitle}>{t('searchResults', language)}</ThemedText>
                            <ThemedText style={styles.resultCount}>({results.length})</ThemedText>
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
                        <ThemedText style={styles.emptyText}>{t('noResults', language)}</ThemedText>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },
    section: {
        paddingHorizontal: 4,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
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
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 12,
        gap: 8,
    },
    resultCount: {
        fontSize: 14,
        opacity: 0.6,
        fontWeight: '600',
        marginBottom: 10,
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
