import { AppColors } from '@/constants/theme';
import { FoodItem } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const SPACING = 16;

interface SwipeableCardStackProps {
    items: FoodItem[];
    onCardPress: (item: FoodItem) => void;
    headerText: string;
}

export function SwipeableCardStack({ items, onCardPress, headerText }: SwipeableCardStackProps) {
    // Randomly select 5 items to show
    const randomItems = useMemo(() => {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    }, [items]);

    if (items.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{headerText}</Text>
            <FlatList
                data={randomItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.listContainer}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => onCardPress(item)} style={styles.card}>
                        {item.imageUri ? (
                            <Image source={{ uri: item.imageUri }} style={styles.cardImage} contentFit="cover" />
                        ) : (
                            <View style={styles.cardPlaceholder}>
                                <Ionicons name="restaurant" size={50} color={AppColors.primaryLight} />
                            </View>
                        )}
                        <View style={styles.cardOverlay}>
                            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingBottom: 24,
    },
    headerText: {
        fontSize: 14,
        fontWeight: '700',
        color: AppColors.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingHorizontal: 20,
        gap: SPACING,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 0.65,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: AppColors.white,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.primary + '12',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingTop: 32,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.white,
    },
});
