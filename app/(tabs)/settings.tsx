import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useData } from '@/store/data-store';
import { LANGUAGES } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Directory, File, Paths } from 'expo-file-system/next';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { language, themeMode, setLanguage, setThemeMode, importData, exportData } = useData();
    const [languageModalVisible, setLanguageModalVisible] = useState(false);

    const handleExport = async () => {
        try {
            const data = exportData();
            if (Platform.OS === 'web') {
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'what-to-cook-backup.json';
                a.click();
                URL.revokeObjectURL(url);
                Alert.alert(t('exportData', language), t('exportSuccess', language));
                return;
            }

            const zip = new JSZip();
            const imagesFolder = zip.folder('images');

            const parsedData = JSON.parse(data);
            const items = Array.isArray(parsedData) ? parsedData : (parsedData.items || []);

            for (const item of items) {
                if (item.imageUri && !item.imageUri.startsWith('http')) {
                    try {
                        const srcFile = new File(item.imageUri);
                        if (srcFile.exists && imagesFolder) {
                            const base64Data = srcFile.base64Sync();
                            imagesFolder.file(srcFile.name, base64Data, { base64: true });
                            item.imageUri = srcFile.name;
                        }
                    } catch (e) {
                        console.warn('Image export failed:', e);
                    }
                }
            }

            zip.file('data.json', JSON.stringify(parsedData));

            const zipContentBase64 = await zip.generateAsync({ type: 'base64' });
            const zipPath = new File(Paths.cache, 'what-to-cook-backup.zip');
            await FileSystem.writeAsStringAsync(zipPath.uri, zipContentBase64, { encoding: 'base64' });

            Alert.alert(t('exportData', language), t('exportSuccess', language));
        } catch (error) {
            console.error(error);
            Alert.alert(t('error', language), String(error));
        }
    };

    const handleShare = async () => {
        try {
            if (Platform.OS === 'web') {
                handleExport();
                return;
            }
            const data = exportData();

            const zip = new JSZip();
            const imagesFolder = zip.folder('images');

            const parsedData = JSON.parse(data);
            const items = Array.isArray(parsedData) ? parsedData : (parsedData.items || []);

            for (const item of items) {
                if (item.imageUri && !item.imageUri.startsWith('http')) {
                    try {
                        const srcFile = new File(item.imageUri);
                        if (srcFile.exists && imagesFolder) {
                            const base64Data = srcFile.base64Sync();
                            imagesFolder.file(srcFile.name, base64Data, { base64: true });
                            item.imageUri = srcFile.name;
                        }
                    } catch { }
                }
            }

            zip.file('data.json', JSON.stringify(parsedData));

            const zipContentBase64 = await zip.generateAsync({ type: 'base64' });
            const zipPath = new File(Paths.cache, 'what-to-cook-archive.zip');
            await FileSystem.writeAsStringAsync(zipPath.uri, zipContentBase64, { encoding: 'base64' });

            await Sharing.shareAsync(zipPath.uri, {
                mimeType: 'application/zip',
                dialogTitle: t('shareMenu', language),
            });
        } catch (error) {
            console.error(error);
            Alert.alert(t('error', language), String(error));
        }
    };

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/zip', 'application/x-zip-compressed', '*/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                if (Platform.OS === 'web') {
                    Alert.alert(t('error', language), 'Zip Import only supported on Native');
                    return;
                }

                const zipUri = result.assets[0].uri;
                const zipBase64 = await FileSystem.readAsStringAsync(zipUri, { encoding: 'base64' });
                const zip = await JSZip.loadAsync(zipBase64, { base64: true });

                const dataFile = zip.file('data.json');
                if (!dataFile) throw new Error("Invalid format: data.json not found.");

                const content = await dataFile.async("string");
                const parsed = JSON.parse(content);
                const items = Array.isArray(parsed) ? parsed : (parsed.items || []);

                const appImagesDir = new Directory(Paths.document, 'images');
                if (!appImagesDir.exists) appImagesDir.create();

                for (const item of items) {
                    if (item.imageUri && !item.imageUri.startsWith('http')) {
                        const imageFile = zip.file(`images/${item.imageUri}`);
                        if (imageFile) {
                            const imgBase64 = await imageFile.async('base64');
                            const destFileUri = `${appImagesDir.uri}/${item.imageUri}`;
                            await FileSystem.writeAsStringAsync(destFileUri, imgBase64, { encoding: 'base64' });
                            item.imageUri = destFileUri;
                        }
                    }
                }

                await importData(JSON.stringify(items));
                Alert.alert(t('importData', language), t('importSuccess', language));
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t('error', language), String(error));
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <Text style={styles.screenTitle}>{t('settings', language)}</Text>

                {/* General Settings */}
                <Text style={styles.sectionTitle}>{t('generalSettings', language)}</Text>
                <View style={styles.card}>
                    {/* Theme */}
                    <Pressable style={styles.settingRow} onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name={themeMode === 'dark' ? 'moon' : 'sunny-outline'}
                                size={22}
                                color={AppColors.primary}
                            />
                            <Text style={styles.settingLabel}>{t('theme', language)}</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>
                                {themeMode === 'light' ? t('lightMode', language) : t('darkMode', language)}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                        </View>
                    </Pressable>

                    <View style={styles.divider} />

                    {/* Language */}
                    <Pressable style={styles.settingRow} onPress={() => setLanguageModalVisible(true)}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="language-outline" size={22} color={AppColors.primary} />
                            <Text style={styles.settingLabel}>{t('language', language)}</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>
                                {LANGUAGES.find(l => l.code === language)?.nativeLabel}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                        </View>
                    </Pressable>
                </View>

                {/* Data Management */}
                <Text style={styles.sectionTitle}>{t('dataManagement', language)}</Text>
                <View style={styles.card}>
                    {/* Import */}
                    <Pressable style={styles.settingRow} onPress={handleImport}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBadge, { backgroundColor: AppColors.primary + '20' }]}>
                                <Ionicons name="cloud-upload-outline" size={18} color={AppColors.primary} />
                            </View>
                            <View>
                                <Text style={styles.settingLabel}>{t('importData', language)}</Text>
                                <Text style={styles.settingDescription}>{t('importDataDesc', language)}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                    </Pressable>

                    <View style={styles.divider} />

                    {/* Export */}
                    <Pressable style={styles.settingRow} onPress={handleExport}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBadge, { backgroundColor: AppColors.tagCarrot + '20' }]}>
                                <Ionicons name="cloud-download-outline" size={18} color={AppColors.tagCarrot} />
                            </View>
                            <View>
                                <Text style={styles.settingLabel}>{t('exportData', language)}</Text>
                                <Text style={styles.settingDescription}>{t('exportDataDesc', language)}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
                    </Pressable>

                    <View style={styles.divider} />

                    {/* Share */}
                    <Pressable style={styles.settingRow} onPress={handleShare}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBadge, { backgroundColor: AppColors.tagSage + '20' }]}>
                                <Ionicons name="share-social-outline" size={18} color={AppColors.tagSage} />
                            </View>
                            <View>
                                <Text style={styles.settingLabel}>{t('shareMenu', language)}</Text>
                                <Text style={styles.settingDescription}>{t('shareMenuDesc', language)}</Text>
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
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('selectLanguage', language)}</Text>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={item => item.code}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.languageOption,
                                        language === item.code && styles.languageOptionActive,
                                    ]}
                                    onPress={() => {
                                        setLanguage(item.code);
                                        setLanguageModalVisible(false);
                                    }}
                                >
                                    <View>
                                        <Text style={[
                                            styles.languageLabel,
                                            language === item.code && styles.languageLabelActive,
                                        ]}>
                                            {item.nativeLabel}
                                        </Text>
                                        <Text style={styles.languageSub}>{item.label}</Text>
                                    </View>
                                    {language === item.code && (
                                        <Ionicons name="checkmark-circle" size={22} color={AppColors.primary} />
                                    )}
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: AppColors.text,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: AppColors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 10,
        marginTop: 8,
    },
    card: {
        backgroundColor: AppColors.white,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
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
        color: AppColors.text,
    },
    settingValue: {
        fontSize: 14,
        color: AppColors.textLight,
    },
    settingDescription: {
        fontSize: 12,
        color: AppColors.textLight,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.border,
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
        backgroundColor: AppColors.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        maxHeight: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: AppColors.text,
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
    languageOptionActive: {
        backgroundColor: AppColors.primary + '10',
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.text,
    },
    languageLabelActive: {
        color: AppColors.primary,
    },
    languageSub: {
        fontSize: 12,
        color: AppColors.textLight,
        marginTop: 2,
    },
});
