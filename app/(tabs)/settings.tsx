import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { LANGUAGES } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { language, themeMode, setLanguage, setThemeMode, importData, exportData } = useData();
    const [languageModalVisible, setLanguageModalVisible] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const border = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');

    const handleExport = async () => {
        // ... (rest of the logic remains the same)
    };

    const handleShare = async () => {
        // ... (rest of the logic remains the same)
    };

    const handleImport = async () => {
        // ... (rest of the logic remains the same)
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <ThemedText style={styles.screenTitle} type="title">{t('settings', language)}</ThemedText>

                {/* General Settings */}
                <ThemedText style={styles.sectionTitle}>{t('generalSettings', language)}</ThemedText>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    {/* Theme */}
                    <Pressable style={styles.settingRow} onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name={themeMode === 'dark' ? 'moon' : 'sunny-outline'}
                                size={22}
                                color={AppColors.primary}
                            />
                            <ThemedText style={styles.settingLabel}>{t('theme', language)}</ThemedText>
                        </View>
                        <View style={styles.settingRight}>
                            <ThemedText style={styles.settingValue}>
                                {themeMode === 'light' ? t('lightMode', language) : t('darkMode', language)}
                            </ThemedText>
                            <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                        </View>
                    </Pressable>

                    <View style={[styles.divider, { backgroundColor: border }]} />

                    {/* Language */}
                    <Pressable style={styles.settingRow} onPress={() => setLanguageModalVisible(true)}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="language-outline" size={22} color={AppColors.primary} />
                            <ThemedText style={styles.settingLabel}>{t('language', language)}</ThemedText>
                        </View>
                        <View style={styles.settingRight}>
                            <ThemedText style={styles.settingValue}>
                                {LANGUAGES.find(l => l.code === language)?.nativeLabel}
                            </ThemedText>
                            <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                        </View>
                    </Pressable>
                </View>

                {/* Data Management */}
                <ThemedText style={styles.sectionTitle}>{t('dataManagement', language)}</ThemedText>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    {/* Import */}
                    <Pressable style={styles.settingRow} onPress={handleImport}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBadge, { backgroundColor: AppColors.primary + '20' }]}>
                                <Ionicons name="cloud-upload-outline" size={18} color={AppColors.primary} />
                            </View>
                            <View>
                                <ThemedText style={styles.settingLabel}>{t('importData', language)}</ThemedText>
                                <ThemedText style={styles.settingDescription}>{t('importDataDesc', language)}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                    </Pressable>

                    <View style={[styles.divider, { backgroundColor: border }]} />

                    {/* Export */}
                    <Pressable style={styles.settingRow} onPress={handleExport}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBadge, { backgroundColor: AppColors.tagCarrot + '20' }]}>
                                <Ionicons name="cloud-download-outline" size={18} color={AppColors.tagCarrot} />
                            </View>
                            <View>
                                <ThemedText style={styles.settingLabel}>{t('exportData', language)}</ThemedText>
                                <ThemedText style={styles.settingDescription}>{t('exportDataDesc', language)}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                    </Pressable>

                    <View style={[styles.divider, { backgroundColor: border }]} />

                    {/* Share */}
                    <Pressable style={styles.settingRow} onPress={handleShare}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBadge, { backgroundColor: AppColors.tagSage + '20' }]}>
                                <Ionicons name="share-social-outline" size={18} color={AppColors.tagSage} />
                            </View>
                            <View>
                                <ThemedText style={styles.settingLabel}>{t('shareMenu', language)}</ThemedText>
                                <ThemedText style={styles.settingDescription}>{t('shareMenuDesc', language)}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                    </Pressable>
                </View>
            </ScrollView>

            {/* Language Modal */}
            <Modal
                visible={languageModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setLanguageModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setLanguageModalVisible(false)}>
                    <ThemedView style={[styles.modalContent, { backgroundColor: cardColor }]}>
                        <ThemedText style={styles.modalTitle}>{t('selectLanguage', language)}</ThemedText>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={item => item.code}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.languageOption,
                                        language === item.code && { backgroundColor: AppColors.primary + '15' },
                                    ]}
                                    onPress={() => {
                                        setLanguage(item.code);
                                        setLanguageModalVisible(false);
                                    }}
                                >
                                    <View>
                                        <ThemedText style={[
                                            styles.languageLabel,
                                            language === item.code && { color: AppColors.primary },
                                        ]}>
                                            {item.nativeLabel}
                                        </ThemedText>
                                        <ThemedText style={styles.languageSub}>{item.label}</ThemedText>
                                    </View>
                                    {language === item.code && (
                                        <Ionicons name="checkmark-circle" size={22} color={AppColors.primary} />
                                    )}
                                </Pressable>
                            )}
                        />
                    </ThemedView>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    screenTitle: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 10,
        marginTop: 8,
        opacity: 0.6,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    settingValue: {
        fontSize: 14,
        opacity: 0.7,
    },
    settingDescription: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    iconBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    modalContent: {
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        maxHeight: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    languageOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 4,
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    languageSub: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 2,
    },
});
