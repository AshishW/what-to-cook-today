import { ThemedText } from '@/components/themed-text';
import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { restoreFromBackupZip } from '@/utils/backup';

export default function WelcomeScreen() {
  const router = useRouter();
  const { language, importData, completeOnboarding } = useData();
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');

  const handleRestoreBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        await restoreFromBackupZip(fileUri, importData);
        await completeOnboarding();
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Hero Icon */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="restaurant" size={64} color={AppColors.white} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)}>
          <ThemedText style={styles.title}>
            {t('onboardingTitle', language)}
          </ThemedText>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)}>
          <ThemedText style={[styles.subtitle, { color: AppColors.textLight }]}>
            {t('onboardingSubtitle', language)}
          </ThemedText>
        </Animated.View>
      </View>

      {/* CTAs */}
      <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.ctaContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace('/onboarding/value' as any)}
        >
          <ThemedText style={styles.primaryButtonText}>
            {t('getStarted', language)}
          </ThemedText>
          <Ionicons name="arrow-forward" size={20} color={AppColors.white} />
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { backgroundColor: cardColor }]}
          onPress={handleRestoreBackup}
        >
          <Ionicons name="cloud-download-outline" size={20} color={AppColors.primary} />
          <ThemedText style={[styles.secondaryButtonText, { color: AppColors.primary }]}>
            {t('restoreBackup', language)}
          </ThemedText>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  ctaContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 6,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  primaryButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
