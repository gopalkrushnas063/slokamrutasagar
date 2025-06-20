import { Audio } from "expo-av"; // Import Audio from expo-av
import React, { useEffect, useRef, useState } from "react";
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
import { completeOnboarding } from "../store/slices/onboardingSlice";
import { GradientBackground } from "../styles/themes";

const { width, height } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  emoji: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Welcome to the Divine Journey!",
    description:
      "Explore the sacred world of Jagannath, Krishna, and the rich heritage of Bhagabat Sanskriti. Immerse yourself in timeless stories, teachings, and cultural traditions that inspire the soul.",
    emoji: require("@/assets/images/app_logo.png"),
  },
  {
    id: "2",
    title: "Hindu Shlokas with Simple Meanings",
    description:
      "Discover a collection of powerful Hindu shlokas from the Vedas, Gita, Upanishads, and more — explained in a simple, easy-to-understand way. Perfect for beginners and spiritual seekers who wish to learn and connect deeply with ancient wisdom.",
    emoji: require("@/assets/images/ob_1.png"),
  },
  {
    id: "3",
    title: "Hindu Divine Spirituality — Illuminating Human Life",
    description: "Embark on a spiritual journey rooted in the wisdom of Hinduism. Discover how divine teachings, sacred shlokas, and timeless traditions bring clarity, peace, and purpose to everyday life. Let ancient light guide your modern path.",
    emoji: require("@/assets/images/ob_2.png"),
  },
  // {
  //   id: "4",
  //   title: "Get Started",
  //   description: "You're all set! Start exploring the app",
  //   emoji: require("@/assets/images/ob_3.png"),
  // },
];

export const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sound, setSound] = useState<Audio.Sound>();
  const dispatch = useDispatch();
  const theme = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Load the sound when component mounts
  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/bg_2.mp3"), // Make sure to add this file to your assets
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

  // Play or pause the sound when isPlaying changes
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

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={[styles.slide, { width }]}>
      {/* <Text style={styles.emoji}>{item.emoji}</Text> */}
      <Image source={item.emoji} style={{ height: 200, width: 200 }} />
      <Text style={[styles.title, { color: "black" }]}>
        {item.title}
      </Text>
      <Text style={[styles.description, { color: "black" }]}>
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
        {/* Background Image in Top-Right Corner */}
        <Image
          source={require("@/assets/images/m4.png")} // Replace with your image path
          style={styles.backgroundImage}
          resizeMode="contain"
        />
        {/* Music toggle button */}
        <TouchableOpacity style={styles.musicButton} onPress={togglePlayPause}>
          <Text style={[styles.musicIcon, { color: theme.text.color }]}>
            {isPlaying ? "🎵" : "🎶"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: "black" }]}>
            Skip
          </Text>
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
            {currentIndex === onboardingData.length - 1
              ? "Get Started"
              : "Next"}
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
  backgroundImage: {
    position: "absolute",
    top: 0,
    alignSelf: "center", // This centers the image horizontally
    width: 220, // Adjust as needed
    height: 100, // Adjust as needed
    // opacity: 0.3, // Optional: Adjust opacity if needed
  },
  musicButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  musicIcon: {
    fontSize: 24,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 10,
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
    marginBottom: 40,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
