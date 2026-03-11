import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { LANGUAGES } from '@/types/types';
import { createBackupZip, restoreFromBackupZip } from '@/utils/backup';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { language, themeMode, setLanguage, setThemeMode, habitSettings, setHabitSettings, importData, exportData } = useData();
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [habitModalVisible, setHabitModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeHabit, setActiveHabit] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
    const [tempTimeRange, setTempTimeRange] = useState({ start: '00:00', end: '00:00' });

    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const border = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');

    const handleExport = async () => {
        setLoading(true);
        try {
            const dataStr = exportData();
            const zipUri = await createBackupZip(dataStr);
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(zipUri, {
                    mimeType: 'application/zip',
                    dialogTitle: t('exportData', language)
                });
            } else {
                Alert.alert(t('error', language), 'Sharing is not available on this device');
            }
        } catch (error) {
            console.error('Export error:', error);
            Alert.alert(t('error', language), t('error', language));
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        setLoading(true);
        try {
            const dataStr = exportData();
            const zipUri = await createBackupZip(dataStr);
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(zipUri, {
                    mimeType: 'application/zip',
                    dialogTitle: t('shareMenu', language)
                });
            } else {
                Alert.alert(t('error', language), 'Sharing is not available on this device');
            }
        } catch (error) {
            console.error('Share error:', error);
            Alert.alert(t('error', language), t('error', language));
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip', '*/*'],
                copyToCacheDirectory: true
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setLoading(true);
                const fileUri = result.assets[0].uri;
                await restoreFromBackupZip(fileUri, importData);
                Alert.alert(t('importData', language), t('importSuccess', language));
            }
        } catch (error) {
            console.error('Import error:', error);
            Alert.alert(t('error', language), t('error', language));
        } finally {
            setLoading(false);
        }
    };

    const openHabitPicker = (key: 'breakfast' | 'lunch' | 'dinner') => {
        setActiveHabit(key);
        setTempTimeRange(habitSettings[key]);
        setHabitModalVisible(true);
    };

    const saveHabitTime = () => {
        if (activeHabit) {
            const newHabits = { ...habitSettings, [activeHabit]: tempTimeRange };
            setHabitSettings(newHabits);
        }
        setHabitModalVisible(false);
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

                {/* Habit Settings */}
                <ThemedText style={styles.sectionTitle}>{t('yourCookingHabits', language)}</ThemedText>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    {/* Breakfast */}
                    <Pressable style={styles.settingRow} onPress={() => openHabitPicker('breakfast')}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="sunny-outline" size={22} color={AppColors.primary} />
                            <View>
                                <ThemedText style={styles.settingLabel}>{t('breakfastHabitTitle', language)}</ThemedText>
                                <ThemedText style={styles.settingValue}>{habitSettings.breakfast.start} - {habitSettings.breakfast.end}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                    </Pressable>

                    <View style={[styles.divider, { backgroundColor: border }]} />

                    {/* Lunch */}
                    <Pressable style={styles.settingRow} onPress={() => openHabitPicker('lunch')}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="partly-sunny-outline" size={22} color={AppColors.primary} />
                            <View>
                                <ThemedText style={styles.settingLabel}>{t('lunchHabitTitle', language)}</ThemedText>
                                <ThemedText style={styles.settingValue}>{habitSettings.lunch.start} - {habitSettings.lunch.end}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                    </Pressable>

                    <View style={[styles.divider, { backgroundColor: border }]} />

                    {/* Dinner */}
                    <Pressable style={styles.settingRow} onPress={() => openHabitPicker('dinner')}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="moon-outline" size={22} color={AppColors.primary} />
                            <View>
                                <ThemedText style={styles.settingLabel}>{t('dinnerHabitTitle', language)}</ThemedText>
                                <ThemedText style={styles.settingValue}>{habitSettings.dinner.start} - {habitSettings.dinner.end}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
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

            {/* Habit Picker Modal */}
            <Modal
                visible={habitModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setHabitModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <ThemedView style={[styles.modalContent, { backgroundColor: cardColor, maxWidth: 400 }]}>
                        <ThemedText style={styles.modalTitle}>
                            {activeHabit ? t((activeHabit + 'HabitTitle') as any, language) : ''}
                        </ThemedText>

                        <View style={styles.timeRangePicker}>
                            {/* Start Time */}
                            <View style={styles.timeColumn}>
                                <ThemedText style={styles.timeLabel}>Start</ThemedText>
                                <TimeSelector
                                    value={tempTimeRange.start}
                                    onChange={(val) => setTempTimeRange(prev => ({ ...prev, start: val }))}
                                />
                            </View>

                            <View style={styles.timeSeparator}>
                                <ThemedText style={{ fontSize: 24, opacity: 0.5 }}>-</ThemedText>
                            </View>

                            {/* End Time */}
                            <View style={styles.timeColumn}>
                                <ThemedText style={styles.timeLabel}>End</ThemedText>
                                <TimeSelector
                                    value={tempTimeRange.end}
                                    onChange={(val) => setTempTimeRange(prev => ({ ...prev, end: val }))}
                                />
                            </View>
                        </View>

                        <Pressable
                            style={[styles.saveButton, { backgroundColor: AppColors.primary }]}
                            onPress={saveHabitTime}
                        >
                            <ThemedText style={styles.saveButtonText}>{t('saveHabits', language)}</ThemedText>
                        </Pressable>

                        <Pressable style={styles.cancelButton} onPress={() => setHabitModalVisible(false)}>
                            <ThemedText style={styles.cancelButtonText}>{t('cancel', language)}</ThemedText>
                        </Pressable>
                    </ThemedView>
                </View>
            </Modal>

            {/* Loading Modal */}
            <Modal
                transparent={true}
                visible={loading}
                animationType="fade"
            >
                <View style={styles.loadingOverlay}>
                    <View style={[styles.loadingContainer, { backgroundColor: cardColor }]}>
                        <ActivityIndicator size="large" color={AppColors.primary} />
                        <ThemedText style={styles.loadingText}>
                            {t('processingData', language)}
                        </ThemedText>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function TimeSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [hours, minutes] = value.split(':').map(Number);

    const updateHours = (delta: number) => {
        const next = (hours + delta + 24) % 24;
        onChange(`${String(next).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    };

    const updateMinutes = (delta: number) => {
        const next = (minutes + delta + 60) % 60;
        onChange(`${String(hours).padStart(2, '0')}:${String(next).padStart(2, '0')}`);
    };

    return (
        <View style={styles.timeSelector}>
            <View style={styles.timePart}>
                <Pressable onPress={() => updateHours(1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-up" size={24} color={AppColors.primary} />
                </Pressable>
                <ThemedText style={styles.timeValue}>{String(hours).padStart(2, '0')}</ThemedText>
                <Pressable onPress={() => updateHours(-1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-down" size={24} color={AppColors.primary} />
                </Pressable>
            </View>
            <ThemedText style={styles.timeColon}>:</ThemedText>
            <View style={styles.timePart}>
                <Pressable onPress={() => updateMinutes(5)} style={styles.arrowButton}>
                    <Ionicons name="chevron-up" size={24} color={AppColors.primary} />
                </Pressable>
                <ThemedText style={styles.timeValue}>{String(minutes).padStart(2, '0')}</ThemedText>
                <Pressable onPress={() => updateMinutes(-5)} style={styles.arrowButton}>
                    <Ionicons name="chevron-down" size={24} color={AppColors.primary} />
                </Pressable>
            </View>
        </View>
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
    // Time Range Picker
    timeRangePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        gap: 20,
    },
    timeColumn: {
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        opacity: 0.5,
        marginBottom: 8,
    },
    timeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        padding: 8,
    },
    timePart: {
        alignItems: 'center',
    },
    timeValue: {
        fontSize: 24,
        fontWeight: '700',
        width: 40,
        textAlign: 'center',
        marginVertical: 4,
    },
    timeColon: {
        fontSize: 24,
        fontWeight: '700',
        marginHorizontal: 4,
    },
    arrowButton: {
        padding: 4,
    },
    timeSeparator: {
        paddingTop: 20,
    },
    saveButton: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: '700',
    },
    cancelButton: {
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    cancelButtonText: {
        opacity: 0.6,
    },
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
