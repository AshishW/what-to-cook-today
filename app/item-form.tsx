import { ImageUploader } from '@/components/ImageUploader';
import { TagChip } from '@/components/TagChip';
import { ThemedText } from '@/components/themed-text';
import { getCategoryTranslation, t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
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

    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const border = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');
    const primary = useThemeColor({}, 'primary');

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
            <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: cardColor, borderBottomColor: border }]}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={textColor} />
                    </Pressable>
                    <ThemedText style={styles.headerTitle}>{screenTitle}</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Image Upload */}
                    <ImageUploader imageUri={imageUri} onImageSelected={setImageUri} />

                    {/* Title */}
                    <ThemedText style={styles.label}>{t('title', language)}</ThemedText>
                    <TextInput
                        style={[styles.input, { backgroundColor: cardColor, borderColor: border, color: textColor }]}
                        placeholder={t('titlePlaceholder', language)}
                        placeholderTextColor={AppColors.textMuted}
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Description */}
                    <ThemedText style={styles.label}>{t('description', language)}</ThemedText>
                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: cardColor, borderColor: border, color: textColor }]}
                        placeholder={t('descriptionPlaceholder', language)}
                        placeholderTextColor={AppColors.textMuted}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Category */}
                    <ThemedText style={styles.label}>{t('category', language)}</ThemedText>
                    <View style={styles.categoryRow}>
                        {CATEGORIES.map(cat => {
                            const isActive = categories.includes(cat);
                            return (
                                <Pressable
                                    key={cat}
                                    onPress={() => toggleCategory(cat)}
                                    style={[
                                        styles.categoryPill,
                                        { borderColor: border, backgroundColor: cardColor },
                                        isActive && [styles.categoryPillActive, { backgroundColor: primary, borderColor: primary }],
                                    ]}
                                >
                                    <ThemedText
                                        style={[
                                            styles.categoryPillText,
                                            isActive && styles.categoryPillTextActive,
                                        ]}
                                    >
                                        {getCategoryTranslation(cat, language)}
                                    </ThemedText>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Tags */}
                    <ThemedText style={styles.label}>{t('tags', language)}</ThemedText>
                    <View style={styles.tagInputRow}>
                        <TextInput
                            style={[styles.tagInput, { backgroundColor: cardColor, borderColor: border, color: textColor }]}
                            placeholder={t('tagPlaceholder', language)}
                            placeholderTextColor={AppColors.textMuted}
                            value={tagInput}
                            onChangeText={setTagInput}
                            onSubmitEditing={handleAddTag}
                            returnKeyType="done"
                        />
                        <Pressable style={[styles.addTagBtn, { backgroundColor: primary }]} onPress={handleAddTag}>
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
                        <Pressable style={[styles.saveButton, { backgroundColor: primary }]} onPress={handleSave}>
                            <ThemedText style={styles.saveButtonText}>{t('save', language)}</ThemedText>
                        </Pressable>
                        <Pressable style={[styles.cancelButton, { backgroundColor: border }]} onPress={() => router.back()}>
                            <ThemedText style={styles.cancelButtonText}>{t('cancel', language)}</ThemedText>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
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
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginTop: 8,
        opacity: 0.6,
    },
    input: {
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        borderWidth: 1,
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
        borderWidth: 1.5,
    },
    categoryPillActive: {
        // Colors applied dynamically
    },
    categoryPillText: {
        fontSize: 13,
        fontWeight: '600',
        opacity: 0.8,
    },
    categoryPillTextActive: {
        color: AppColors.white,
        opacity: 1,
    },
    tagInputRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    tagInput: {
        flex: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        borderWidth: 1,
    },
    addTagBtn: {
        width: 46,
        height: 46,
        borderRadius: 14,
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
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        opacity: 0.8,
    },
});
