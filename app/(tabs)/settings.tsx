import { setLanguage } from "@/src/store/slices/languageSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../src/context/ThemeContext";
import { RootState } from "../../src/store";
import { resetOnboarding } from "../../src/store/slices/onboardingSlice";
import { setTheme, toggleTheme } from "../../src/store/slices/themeSlice";
import { GradientBackground } from "../../src/styles/themes";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  // Replace your changeLanguage function with:
  const changeLanguage = (lng: string) => {
    dispatch(setLanguage(lng));
  };

  const languageOptions = [
    { code: "en", name: t("languages.english"), icon: "language-outline" },
    { code: "hi", name: t("languages.hindi"), icon: "language-outline" },
    { code: "or", name: t("languages.odia"), icon: "language-outline" },
    { code: "bn", name: t("languages.bengali"), icon: "language-outline" },
  ];

  const handleResetOnboarding = () => {
    Alert.alert(
      t("settings.resetOnboarding"),
      t("settings.resetOnboardingConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.reset"),
          onPress: () => {
            dispatch(resetOnboarding());
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
    isSelected = false,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    isSelected?: boolean;
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
        <Ionicons
          name={isSelected ? "radio-button-on" : (icon as any)}
          size={24}
          color={isSelected ? "#FFA500" : theme.text.color}
        />
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
      {showArrow && !isSelected && (
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
            {t("settings.title")}
          </Text>

          {/* Language Section */}
          <Text
            style={[
              theme.text,
              { fontSize: 18, fontWeight: "600", marginBottom: 15 },
            ]}
          >
            {t("settings.language")}
          </Text>

          {languageOptions.map((lang) => (
            <SettingsItem
              key={lang.code}
              icon={lang.icon}
              title={lang.name}
              onPress={() => changeLanguage(lang.code)}
              isSelected={i18n.language === lang.code}
            />
          ))}

          {/* Theme Section */}
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
            {t("settings.appearance")}
          </Text>

          <SettingsItem
            icon="color-palette-outline"
            title={t("settings.theme")}
            subtitle={`${t("common.current")}: ${currentTheme}`}
            onPress={() => dispatch(toggleTheme())}
            showArrow
          />

          <SettingsItem
            icon="moon-outline"
            title={t("settings.darkMode")}
            subtitle={t("settings.darkModeSubtitle")}
            onPress={() => dispatch(setTheme("dark"))}
          />

          <SettingsItem
            icon="color-filter-outline"
            title={t("settings.gradientTheme")}
            subtitle={t("settings.gradientThemeSubtitle")}
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
            {t("settings.app")}
          </Text>

          <SettingsItem
            icon="refresh-outline"
            title={t("settings.resetOnboarding")}
            subtitle={t("settings.resetOnboardingSubtitle")}
            onPress={handleResetOnboarding}
          />

          <SettingsItem
            icon="information-circle-outline"
            title={t("settings.about")}
            subtitle={t("settings.aboutSubtitle")}
            onPress={() => Alert.alert(t("settings.about"), "Theme App v1.0.0")}
            showArrow
          />

          <SettingsItem
            icon="help-circle-outline"
            title={t("settings.help")}
            subtitle={t("settings.helpSubtitle")}
            onPress={() =>
              Alert.alert(t("settings.help"), t("common.comingSoon"))
            }
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
