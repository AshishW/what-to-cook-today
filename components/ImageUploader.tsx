import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useData } from '@/store/data-store';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, AlertButton, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface ImageUploaderProps {
    imageUri: string;
    onImageSelected: (uri: string) => void;
}

export function ImageUploader({ imageUri, onImageSelected }: ImageUploaderProps) {
    const { language } = useData();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t('error', language), 'Camera permission is required.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    const label = imageUri ? t('replaceImage', language) : t('uploadImage', language);

    const handlePress = () => {
        if (Platform.OS === 'web') {
            pickImage();
            return;
        }

        const options: AlertButton[] = [
            { text: 'Take Photo', onPress: takePhoto },
            { text: 'Choose from Library', onPress: pickImage },
        ];

        if (imageUri) {
            options.push({ text: 'Remove Image', onPress: () => onImageSelected(''), style: 'destructive' });
        }

        options.push({ text: t('cancel', language), style: 'cancel' });

        Alert.alert(label, 'Choose an option', options);
    };

    return (
        <View style={styles.mainWrapper}>
            <View style={styles.container}>
                {imageUri ? (
                    <View style={styles.preview}>
                        <Pressable onPress={handlePress} style={StyleSheet.absoluteFillObject}>
                            <Image
                                source={{ uri: imageUri }}
                                style={StyleSheet.absoluteFillObject}
                                contentFit="cover"
                                transition={150}
                            />
                        </Pressable>
                        <View style={[styles.overlayButton, { elevation: 5 }]}>
                            <Ionicons name="camera-outline" size={18} color={AppColors.white} />
                            <Text style={styles.overlayText}>{label}</Text>
                        </View>
                        <Pressable
                            style={styles.removeButton}
                            onPress={() => onImageSelected('')}
                        >
                            <Ionicons name="trash-outline" size={18} color={AppColors.white} />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable onPress={handlePress} style={styles.dropzone}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="cloud-upload-outline" size={32} color={AppColors.primary} />
                        </View>
                        <Text style={styles.dropzoneLabel}>{label}</Text>
                        <Text style={styles.dropzoneHint}>(JPEG/PNG)</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        width: '100%',
        marginBottom: 16,
    },
    container: {
        width: '100%',
    },
    dropzone: {
        width: '100%',
        height: 180,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: AppColors.border,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.white,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: AppColors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    dropzoneLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: AppColors.text,
        marginBottom: 4,
    },
    dropzoneHint: {
        fontSize: 12,
        color: AppColors.textMuted,
    },
    preview: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        backgroundColor: '#E5E7EB', // Lighter gray background for loading
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlayButton: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        zIndex: 10,
        pointerEvents: 'none',
    },
    overlayText: {
        color: AppColors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    removeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // red-500 with opacity
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
