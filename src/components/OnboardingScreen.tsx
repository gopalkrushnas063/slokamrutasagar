import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { completeOnboarding } from "../store/slices/onboardingSlice";
import { GradientBackground } from "../styles/themes";

const { width, height } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Welcome!",
    description: "Discover amazing themes and personalize your experience",
    emoji: "⭕️❗️⭕️",
  },
  {
    id: "2",
    title: "Dark Mode",
    description: "Switch to dark mode for a comfortable viewing experience",
    emoji: "🕉️",
  },
  {
    id: "3",
    title: "Gradient Theme",
    description: "Try our beautiful gradient theme for a vibrant look",
    emoji: "🔱",
  },
  {
    id: "4",
    title: "Get Started",
    description: "You're all set! Start exploring the app",
    emoji: "🦚",
  },
];

export const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const theme = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handleSkip = () => {
    dispatch(completeOnboarding());
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
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.title, { color: theme.text.color }]}>
        {item.title}
      </Text>
      <Text style={[styles.description, { color: theme.text.color }]}>
        {item.description}
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
                index === currentIndex ? "#FFA500" : "rgba(255, 255, 255, 0.3)",
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.text.color }]}>Skip</Text>
        </TouchableOpacity>

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
            {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  slide: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    marginBottom: 30,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});