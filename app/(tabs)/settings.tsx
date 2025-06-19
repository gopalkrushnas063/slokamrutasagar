import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../src/context/ThemeContext";
import { RootState } from "../../src/store";
import { resetOnboarding } from "../../src/store/slices/onboardingSlice";
import { setTheme, toggleTheme } from "../../src/store/slices/themeSlice";
import { GradientBackground } from "../../src/styles/themes";

export default function SettingsScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will show the onboarding screen again. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: () => {
            dispatch(resetOnboarding());
            // Use router.push instead of replace, and navigate to the root
            router.push("/");
          },
        },
      ]
    );
  };

  const SettingsItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = false,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        {
          backgroundColor: currentTheme === "dark" ? "#2a2a2a" : "#f8f8f8",
          borderBottomColor: currentTheme === "dark" ? "#444" : "#e0e0e0",
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon as any} size={24} color={theme.text.color} />
        <View style={{ marginLeft: 15 }}>
          <Text style={[theme.text, { fontSize: 16, fontWeight: "500" }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[theme.text, { fontSize: 14, opacity: 0.6, marginTop: 2 }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.text.color}
          style={{ opacity: 0.5 }}
        />
      )}
    </TouchableOpacity>
  );

  const renderContent = () => (
    <SafeAreaView style={[theme.container, { flex: 1 }]}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <Text
            style={[
              theme.text,
              { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
            ]}
          >
            Settings ⚙️
          </Text>

          {/* Theme Section */}
          <Text
            style={[
              theme.text,
              { fontSize: 18, fontWeight: "600", marginBottom: 15 },
            ]}
          >
            Appearance
          </Text>

          <SettingsItem
            icon="color-palette-outline"
            title="Theme"
            subtitle={`Current: ${currentTheme}`}
            onPress={() => dispatch(toggleTheme())}
            showArrow
          />

          <SettingsItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            onPress={() => dispatch(setTheme("dark"))}
          />

          <SettingsItem
            icon="color-filter-outline"
            title="Gradient Theme"
            subtitle="Use colorful gradient background"
            onPress={() => dispatch(setTheme("gradient"))}
          />

          {/* App Section */}
          <Text
            style={[
              theme.text,
              {
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 15,
                marginTop: 30,
              },
            ]}
          >
            App
          </Text>

          <SettingsItem
            icon="refresh-outline"
            title="Reset Onboarding"
            subtitle="Show welcome screens again"
            onPress={handleResetOnboarding}
          />

          <SettingsItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version and info"
            onPress={() => Alert.alert("About", "Theme App v1.0.0")}
            showArrow
          />

          <SettingsItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => Alert.alert("Help", "Coming soon!")}
            showArrow
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  if (currentTheme === "gradient") {
    return <GradientBackground>{renderContent()}</GradientBackground>;
  }

  return renderContent();
}

const styles = {
  settingsItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 15,
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
};
