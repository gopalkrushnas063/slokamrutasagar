// app/index.tsx
import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { OnboardingScreen } from '../src/components/OnboardingScreen';
import { Redirect } from 'expo-router';

export default function Index() {
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.onboarding.hasCompletedOnboarding
  );

  // If onboarding is completed, redirect to tabs
  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  // Show onboarding if not completed
  return <OnboardingScreen />;
}