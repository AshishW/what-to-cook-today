import { ThemedText } from '@/components/themed-text';
import { t } from '@/constants/i18n';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StepItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  delay: number;
  index: number;
}

function StepItem({ icon, title, delay, index }: StepItemProps) {
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const stepColors = [AppColors.primary, AppColors.tagCarrot, AppColors.tagSage];

  return (
    <Animated.View
      entering={FadeInRight.duration(500).delay(delay)}
      style={[styles.stepCard, { backgroundColor: cardColor, borderColor }]}
    >
      <View style={[styles.stepIconCircle, { backgroundColor: stepColors[index] + '20' }]}>
        <Ionicons name={icon} size={28} color={stepColors[index]} />
      </View>
      <View style={styles.stepTextContainer}>
        <ThemedText style={styles.stepNumber}>Step {index + 1}</ThemedText>
        <ThemedText style={styles.stepTitle}>{title}</ThemedText>
      </View>
    </Animated.View>
  );
}

export default function ValueScreen() {
  const router = useRouter();
  const { language } = useData();
  const backgroundColor = useThemeColor({}, 'background');

  const steps: { icon: keyof typeof Ionicons.glyphMap; titleKey: 'addMealsTitle' | 'trackMealsTitle' | 'smartSuggestionsTitle' }[] = [
    { icon: 'add-circle-outline', titleKey: 'addMealsTitle' },
    { icon: 'calendar-outline', titleKey: 'trackMealsTitle' },
    { icon: 'bulb-outline', titleKey: 'smartSuggestionsTitle' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <ThemedText style={styles.headerTitle}>
            {t('onboardingValueHeader', language)}
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: AppColors.textLight }]}>
            {t('onboardingValueSubtitle', language)}
          </ThemedText>
        </Animated.View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <StepItem
              key={step.titleKey}
              icon={step.icon}
              title={t(step.titleKey, language)}
              delay={300 + index * 200}
              index={index}
            />
          ))}
        </View>
      </View>

      {/* Footer CTA */}
      <Animated.View entering={FadeInDown.duration(500).delay(1000)} style={styles.footer}>
        <Pressable
          style={styles.continueButton}
          onPress={() => router.replace('/onboarding/quick-meals' as any)}
        >
          <ThemedText style={styles.continueButtonText}>
            {t('continue', language)}
          </ThemedText>
          <Ionicons name="arrow-forward" size={20} color={AppColors.white} />
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
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 40,
    opacity: 0.7,
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    gap: 16,
  },
  stepIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.5,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  continueButton: {
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
  continueButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
