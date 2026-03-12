import { ThemedText } from '@/components/themed-text';
import { t } from '@/constants/i18n';
import { ONBOARDING_MEALS } from '@/constants/seed-data';
import { AppColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/store/data-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MealChipProps {
  title: string;
  selected: boolean;
  onToggle: () => void;
  index: number;
}

function MealChip({ title, selected, onToggle, index }: MealChipProps) {
  const scale = useSharedValue(1);
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
    onToggle();
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100 + index * 60)}>
      <AnimatedPressable
        onPress={handlePress}
        style={[
          styles.chip,
          { backgroundColor: selected ? AppColors.primary : cardColor, borderColor: selected ? AppColors.primary : borderColor },
          animatedStyle,
        ]}
      >
        {selected && (
          <Ionicons name="checkmark-circle" size={18} color={AppColors.white} style={{ marginRight: 4 }} />
        )}
        <ThemedText style={[styles.chipText, selected && styles.chipTextSelected]}>
          {title}
        </ThemedText>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function QuickMealsScreen() {
  const router = useRouter();
  const { language, addOnboardingMeals, completeOnboarding } = useData();
  const backgroundColor = useThemeColor({}, 'background');
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const toggleMeal = (index: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const canSubmit = selectedIndices.size >= 3;

  const handleAddMeals = async () => {
    const selectedMeals = Array.from(selectedIndices).map(i => ONBOARDING_MEALS[i]);
    await addOnboardingMeals(selectedMeals);
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleOther = () => {
    router.push('/item-form');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <ThemedText style={styles.title}>
              {t('whatMealsDoYouCook', language)}
            </ThemedText>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <ThemedText style={[styles.subtitle, { color: AppColors.textLight }]}>
              {t('pickFewToStart', language)}
            </ThemedText>
          </Animated.View>
        </View>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <ThemedText style={[styles.skipText, { color: AppColors.textLight }]}>
            {t('skip', language)}
          </ThemedText>
        </Pressable>
      </View>

      {/* Meal Chips Grid */}
      <ScrollView
        contentContainerStyle={styles.chipsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chipsGrid}>
          {ONBOARDING_MEALS.map((meal, index) => (
            <MealChip
              key={meal.title}
              title={meal.title}
              selected={selectedIndices.has(index)}
              onToggle={() => toggleMeal(index)}
              index={index}
            />
          ))}

          {/* Other chip */}
          <Animated.View entering={FadeInDown.duration(400).delay(100 + ONBOARDING_MEALS.length * 60)}>
            <Pressable
              onPress={handleOther}
              style={[styles.chip, styles.otherChip]}
            >
              <Ionicons name="add" size={18} color={AppColors.primary} />
              <ThemedText style={[styles.chipText, { color: AppColors.primary }]}>
                {t('other', language)}
              </ThemedText>
            </Pressable>
          </Animated.View>
        </View>

        {/* Selection counter */}
        <Animated.View entering={FadeInDown.duration(400).delay(800)}>
          <ThemedText style={[styles.counter, { color: AppColors.textLight }]}>
            {selectedIndices.size} / 3 {t('mealsSelected', language)}
          </ThemedText>
        </Animated.View>
      </ScrollView>

      {/* CTA */}
      <Animated.View entering={FadeInUp.duration(500).delay(600)} style={styles.footer}>
        <Pressable
          style={[
            styles.addButton,
            !canSubmit && styles.addButtonDisabled,
          ]}
          onPress={handleAddMeals}
          disabled={!canSubmit}
        >
          <ThemedText style={styles.addButtonText}>
            {t('addSelectedMeals', language)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.7,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chipsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: AppColors.white,
  },
  otherChip: {
    borderColor: AppColors.primary,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    gap: 4,
  },
  counter: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  addButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  addButtonDisabled: {
    backgroundColor: AppColors.textMuted,
    elevation: 0,
    shadowOpacity: 0,
  },
  addButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
