import { TagChip } from '@/components/TagChip';
import { getCategoryTranslation, t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useData } from '@/store/data-store';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ItemDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getItemById, deleteItem, language } = useData();
    const item = getItemById(id);

    if (!item) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Item not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            t('deleteConfirmTitle', language),
            t('deleteConfirmMessage', language),
            [
                { text: t('cancel', language), style: 'cancel' },
                {
                    text: t('confirm', language),
                    style: 'destructive',
                    onPress: async () => {
                        await deleteItem(item.id);
                        router.back();
                    },
                },
            ]
        );
    };

    const handleEdit = () => {
        router.push({ pathname: '/item-form', params: { id: item.id } });
    };

    return (
        <View style={styles.container}>
            <ScrollView bounces={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    {item.imageUri ? (
                        <Image source={{ uri: item.imageUri }} style={styles.headerImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="restaurant" size={60} color={AppColors.primaryLight} />
                        </View>
                    )}
                    {/* Back button */}
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={AppColors.text} />
                    </Pressable>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>

                    <View style={styles.tagsContainer}>
                        {item.categories.map((cat, index) => (
                            <View key={cat} style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>
                                    {getCategoryTranslation(cat, language)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {item.description ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('description', language)}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    ) : null}

                    {item.tags.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('tags', language)}</Text>
                            <View style={styles.tagsContainer}>
                                {item.tags.map((tag, index) => (
                                    <TagChip key={tag} label={tag} index={index} />
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <Pressable style={styles.editButton} onPress={handleEdit}>
                            <Ionicons name="create-outline" size={19} color={AppColors.white} />
                            <Text style={styles.editButtonText}>{t('edit', language)}</Text>
                        </Pressable>
                        <Pressable style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={19} color={AppColors.danger} />
                            <Text style={styles.deleteButtonText}>{t('delete', language)}</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        fontSize: 16,
        color: AppColors.textMuted,
    },
    imageContainer: {
        width: '100%',
        height: 280,
        backgroundColor: AppColors.primary + '10',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        padding: 20,
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: AppColors.background,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: AppColors.text,
        marginBottom: 10,
    },
    categoryBadge: {
        backgroundColor: AppColors.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: AppColors.primary,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: AppColors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: AppColors.textLight,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        paddingBottom: 40,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: AppColors.primary,
        paddingVertical: 14,
        borderRadius: 14,
    },
    editButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: AppColors.white,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: AppColors.dangerLight,
        paddingVertical: 14,
        borderRadius: 14,
    },
    deleteButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: AppColors.danger,
    },
});
