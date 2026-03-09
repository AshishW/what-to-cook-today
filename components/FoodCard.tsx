import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FoodItem } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

const CARD_WIDTH = (Dimensions.get('window').width - 56) / 2;

interface FoodCardProps {
    item: FoodItem | { id: string; category: string };
    onPress: () => void;
    isPlaceholder?: boolean;
}

export function FoodCard({ item, onPress, isPlaceholder }: FoodCardProps) {
    const cardColor = useThemeColor({}, 'card');
    const border = useThemeColor({}, 'border');

    if (isPlaceholder) {
        const placeholderItem = item as { category: string };
        return (
            <Pressable onPress={onPress} style={[styles.card, styles.placeholderCard, { backgroundColor: 'transparent', borderColor: border }]}>
                <View style={styles.placeholderContent}>
                    <View style={styles.plusCircle}>
                        <Ionicons name="add" size={24} color={AppColors.primary} />
                    </View>
                    <ThemedText style={styles.placeholderText}>Add {placeholderItem.category}</ThemedText>
                </View>
            </Pressable>
        );
    }

    const foodItem = item as FoodItem;

    return (
        <Pressable onPress={onPress} style={[styles.card, { backgroundColor: cardColor }]}>
            <View style={styles.fullCard}>
                {foodItem.imageUri ? (
                    <Image source={{ uri: foodItem.imageUri }} style={styles.image} />
                ) : (
                    <View style={[styles.iconPlaceholder, { backgroundColor: AppColors.tagCream + '20' }]}>
                        <Ionicons name="restaurant-outline" size={32} color={AppColors.primaryLight} />
                    </View>
                )}
                <View style={styles.textOverlay}>
                    <ThemedText style={styles.title} numberOfLines={2}>
                        {foodItem.title}
                    </ThemedText>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.3,
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    placeholderCard: {
        borderWidth: 2,
        borderStyle: 'dashed',
        elevation: 0,
        shadowOpacity: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderContent: {
        alignItems: 'center',
        padding: 12,
    },
    plusCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: AppColors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    placeholderText: {
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        opacity: 0.7,
    },
    fullCard: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        padding: 12,
        minHeight: '35%',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF', // Keep white on dark overlay
        lineHeight: 18,
    },
});
