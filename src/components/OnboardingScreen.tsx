import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useDispatch } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { setLanguage } from "../store/slices/languageSlice";
import { completeOnboarding } from "../store/slices/onboardingSlice";
import { GradientBackground } from "../styles/themes";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    titleKey: "onboarding.screen1.title",
    descriptionKey: "onboarding.screen1.description",
    emoji: require("@/assets/images/app_logo.png"),
  },
  {
    id: "2",
    titleKey: "onboarding.screen2.title",
    descriptionKey: "onboarding.screen2.description",
    emoji: require("@/assets/images/ob_1.png"),
  },
  {
    id: "3",
    titleKey: "onboarding.screen3.title",
    descriptionKey: "onboarding.screen3.description",
    emoji: require("@/assets/images/ob_2.png"),
  },
];

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
];

export const OnboardingScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sound, setSound] = useState<Audio.Sound>();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const languageButtonRef = useRef<null | View>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const measureLanguageButton = () => {
    if (languageButtonRef.current) {
      languageButtonRef.current.measureInWindow(
        (x: any, y: any, width: any, height: any) => {
          setDropdownPosition({
            top: y + height + 10,
            left: x,
          });
        }
      );
    }
  };

  const toggleLanguageDropdown = () => {
    if (!showLanguageDropdown) {
      measureLanguageButton();
    }
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/bg_2.mp3"),
        { shouldPlay: false, isLooping: true }
      );
      setSound(sound);
    }

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (!sound) return;

    if (isPlaying) {
      sound.playAsync();
    } else {
      sound.pauseAsync();
    }
  }, [isPlaying, sound]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      if (sound) {
        sound.stopAsync();
      }
      dispatch(completeOnboarding());
    }
  };

  const handleSkip = () => {
    if (sound) {
      sound.stopAsync();
    }
    dispatch(completeOnboarding());
  };

  const changeLanguage = (lng: string) => {
    dispatch(setLanguage(lng));
    i18n.changeLanguage(lng);
    setShowLanguageDropdown(false);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={[styles.slide, { width }]}>
      <Image source={item.emoji} style={{ height: 200, width: 200 }} />
      <Text style={[styles.title, { color: "#922033" }]}>{t(item.titleKey)}</Text>
      <Text style={[styles.description, { color: "#922033" }]}>
        {t(item.descriptionKey)}
      </Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentIndex ? "#922033" : "rgba(255, 255, 255, 0.3)",
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GradientBackground>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            {/* Left Side - Language and Music */}
            <View style={styles.leftContainer}>
              <TouchableOpacity
                ref={languageButtonRef}
                style={styles.languageButton}
                onPress={toggleLanguageDropdown}
              >
                <Ionicons name="language" size={24} color="#922033" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.musicButton} onPress={togglePlayPause}>
                <Text style={[styles.musicIcon, { color: theme.text.color }]}>
                  {isPlaying ? "🎵" : "🎶"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Center - Logo */}
            <View style={styles.centerContainer}>
              <Image
                source={require("@/assets/images/m4.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Right Side - Skip */}
            <View style={styles.rightContainer}>
              <TouchableOpacity onPress={handleSkip}>
                <Text style={[styles.skipText, { color: "#922033" }]}>
                  {t("common.skip")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showLanguageDropdown && (
            <LinearGradient
              colors={["#fafafa", "#d19a9c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.languageDropdown,
                {
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  shadowColor: theme.text.color,
                },
              ]}
            >
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageOption}
                  onPress={() => changeLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageText,
                      {
                        color:
                          i18n.language === lang.code
                            ? "#922033"
                            : theme.text.color,
                      },
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {i18n.language === lang.code && (
                    <Ionicons name="checkmark" size={20} color="#922033" />
                  )}
                </TouchableOpacity>
              ))}
            </LinearGradient>
          )}

          <FlatList
            ref={flatListRef}
            data={onboardingData}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item) => item.id}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={16}
          />

          {renderPagination()}

          <TouchableOpacity
            style={[styles.nextButton, theme.button]}
            onPress={handleNext}
          >
            <Text style={[styles.nextButtonText, theme.buttonText]}>
              {currentIndex === onboardingData.length - 1
                ? t("common.getStarted")
                : t("common.next")}
            </Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoImage: {
    width: 220,
    height: 100,
    tintColor: "#922033"
  },
  languageButton: {
    marginRight: 15,
  },
  musicButton: {
    marginRight: 10,
  },
  musicIcon: {
    fontSize: 24,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  languageDropdown: {
    position: 'absolute',
    width: 100,
    borderRadius: 8,
    padding: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  languageText: {
    fontSize: 16,
  },
  slide: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButton: {
    marginHorizontal: 40,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});