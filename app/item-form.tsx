import { ImageUploader } from '@/components/ImageUploader';
import { TagChip } from '@/components/TagChip';
import { getCategoryTranslation, t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useData } from '@/store/data-store';
import { CATEGORIES, Category } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ItemFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { getItemById, addItem, updateItem, language } = useData();

    const existingItem = id ? getItemById(id) : undefined;
    const isEditing = !!existingItem;

    const [title, setTitle] = useState(existingItem?.title || '');
    const [description, setDescription] = useState(existingItem?.description || '');
    const [imageUri, setImageUri] = useState(existingItem?.imageUri || '');
    const [tags, setTags] = useState<string[]>(existingItem?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [categories, setCategories] = useState<Category[]>(
        existingItem?.categories || [id ? 'Dinner' : (useLocalSearchParams().category as Category) || 'Dinner']
    );

    const toggleCategory = (cat: Category) => {
        if (categories.includes(cat)) {
            // Ensure at least one category remains selected
            if (categories.length > 1) {
                setCategories(categories.filter(c => c !== cat));
            }
        } else {
            setCategories([...categories, cat]);
        }
    };

    const handleAddTag = () => {
        const trimmed = tagInput.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert(t('error', language), t('titleRequired', language));
            return;
        }

        const itemData = {
            title: title.trim(),
            description: description.trim(),
            imageUri,
            tags,
            categories,
        };

        if (isEditing && existingItem) {
            await updateItem({ ...existingItem, ...itemData });
        } else {
            await addItem(itemData);
        }

        router.back();
    };

    const screenTitle = isEditing ? t('editItem', language) : t('createItem', language);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={AppColors.text} />
                    </Pressable>
                    <Text style={styles.headerTitle}>{screenTitle}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Image Upload */}
                    <ImageUploader imageUri={imageUri} onImageSelected={setImageUri} />

                    {/* Title */}
                    <Text style={styles.label}>{t('title', language)}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('titlePlaceholder', language)}
                        placeholderTextColor={AppColors.textMuted}
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Description */}
                    <Text style={styles.label}>{t('description', language)}</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder={t('descriptionPlaceholder', language)}
                        placeholderTextColor={AppColors.textMuted}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Category */}
                    <Text style={styles.label}>{t('category', language)}</Text>
                    <View style={styles.categoryRow}>
                        {CATEGORIES.map(cat => {
                            const isActive = categories.includes(cat);
                            return (
                                <Pressable
                                    key={cat}
                                    onPress={() => toggleCategory(cat)}
                                    style={[
                                        styles.categoryPill,
                                        isActive && styles.categoryPillActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryPillText,
                                            isActive && styles.categoryPillTextActive,
                                        ]}
                                    >
                                        {getCategoryTranslation(cat, language)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Tags */}
                    <Text style={styles.label}>{t('tags', language)}</Text>
                    <View style={styles.tagInputRow}>
                        <TextInput
                            style={styles.tagInput}
                            placeholder={t('tagPlaceholder', language)}
                            placeholderTextColor={AppColors.textMuted}
                            value={tagInput}
                            onChangeText={setTagInput}
                            onSubmitEditing={handleAddTag}
                            returnKeyType="done"
                        />
                        <Pressable style={styles.addTagBtn} onPress={handleAddTag}>
                            <Ionicons name="add" size={20} color={AppColors.white} />
                        </Pressable>
                    </View>
                    {tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {tags.map((tag, index) => (
                                <Pressable key={tag} onPress={() => handleRemoveTag(tag)}>
                                    <TagChip label={tag} index={index} />
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <Pressable style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>{t('save', language)}</Text>
                        </Pressable>
                        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                            <Text style={styles.cancelButtonText}>{t('cancel', language)}</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
        backgroundColor: AppColors.white,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.text,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: AppColors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        backgroundColor: AppColors.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: AppColors.text,
        borderWidth: 1,
        borderColor: AppColors.border,
        marginBottom: 8,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: AppColors.white,
        borderWidth: 1.5,
        borderColor: AppColors.border,
    },
    categoryPillActive: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    categoryPillText: {
        fontSize: 13,
        fontWeight: '600',
        color: AppColors.textLight,
    },
    categoryPillTextActive: {
        color: AppColors.white,
    },
    tagInputRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    tagInput: {
        flex: 1,
        backgroundColor: AppColors.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: AppColors.text,
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    addTagBtn: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: AppColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    saveButton: {
        flex: 1,
        backgroundColor: AppColors.primary,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: AppColors.white,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: AppColors.border,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: AppColors.textLight,
    },
});
