import { useData } from '@/store/data-store';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DataProvider } from '@/store/data-store';
import { AppColors } from '@/constants/theme';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { loading, hasCompletedOnboarding } = useData();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppColors.background }}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="item-detail"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="item-form"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="onboarding/welcome"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="onboarding/value"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="onboarding/quick-meals"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      {!hasCompletedOnboarding && <Redirect href={"/onboarding/welcome" as any} />}
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <DataProvider>
      <RootNavigator />
    </DataProvider>
  );
}
