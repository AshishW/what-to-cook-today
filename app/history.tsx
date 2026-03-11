import { ThemedText } from '@/components/themed-text';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { CookLog } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const router = useRouter();
    const { cookLogs, themeMode } = useData();
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'cardBackground' as any) || (themeMode === 'dark' ? '#1E1E1E' : '#FFFFFF');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderItem = ({ item }: { item: CookLog }) => (
        <View style={[styles.logCard, { backgroundColor: themeMode === 'dark' ? '#252525' : '#FFFFFF' }]}>
            <View style={styles.logIcon}>
                <Ionicons name="restaurant" size={20} color={AppColors.primary} />
            </View>
            <View style={styles.logInfo}>
                <ThemedText style={styles.recipeTitle}>{item.recipeTitle}</ThemedText>
                <ThemedText style={styles.cookedAt}>{formatDate(item.cookedAt)}</ThemedText>
            </View>
            <Pressable
                style={styles.viewButton}
                onPress={() => router.push({ pathname: '/item-detail', params: { id: item.recipeId } })}
            >
                <Ionicons name="chevron-forward" size={20} color={AppColors.primaryLight} />
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['bottom']}>
            <Stack.Screen
                options={{
                    title: 'Your Meal History',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerTintColor: AppColors.primary,
                }}
            />

            <FlatList
                data={cookLogs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={60} color={AppColors.primaryLight} opacity={0.5} />
                        <ThemedText style={styles.emptyText}>No meal history yet.</ThemedText>
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
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    logCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 107, 74, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logInfo: {
        flex: 1,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    cookedAt: {
        fontSize: 13,
        opacity: 0.6,
    },
    viewButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.6,
    },
});
