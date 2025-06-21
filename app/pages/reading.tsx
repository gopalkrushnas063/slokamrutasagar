import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "../../src/context/ThemeContext";
import { RootState } from "../../src/store";
import { GradientBackground } from "../../src/styles/themes";
import { getAllVerses } from "@/src/data/books";
import { getLocalizedBookData } from "@/src/utils/bookDataHelper";

export default function ReadingScreen() {
  const navigation = useNavigation();
  const { id, chapter: chapterParam, verse: verseParam } = useLocalSearchParams();
  const chapter = Number(chapterParam) || 1;
  const verse = Number(verseParam) || 1;
  
  const theme = useTheme();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(0);
  const progressBarRef = useRef<View>(null);

  // Get book data and current verse
  const book = getLocalizedBookData(id as string);
  const currentChapter = book.chapters.find(ch => ch.chapter === chapter);
  const currentVerse = currentChapter?.verses.find(v => v.verse === verse);
  const allVerses = getAllVerses(book);
  const currentIndex = allVerses.findIndex(v => v.chapter === chapter && v.verse === verse);

  // Handle back navigation and cleanup
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    });
    return unsubscribe;
  }, [navigation, sound]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        progressBarRef.current?.measure((x, y, width) => {
          progressBarWidth.current = width;
          const touchX = evt.nativeEvent.locationX;
          const newPosition = Math.max(0, Math.min((touchX / width) * duration, duration));
          setPosition(newPosition);
          progressAnim.setValue(newPosition / duration);
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (progressBarWidth.current > 0) {
          const newPosition = Math.max(0, Math.min(position + (gestureState.dx / progressBarWidth.current) * duration, duration));
          setPosition(newPosition);
          progressAnim.setValue(newPosition / duration);
        }
      },
      onPanResponderRelease: () => {
        if (sound) {
          sound.setPositionAsync(position * 1000);
          if (!isPlaying) {
            sound.playAsync().then(() => setIsPlaying(true));
          }
        }
      },
    })
  ).current;

  // Theme-based styles
  const getDynamicStyles = () => {
    if (currentTheme === "dark") {
      return {
        header: {
          backgroundColor: "transparent",
          borderBottomColor: "#444",
        },
        headerTitle: {
          color: "#ffffff",
        },
        backButton: {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
          padding: 8,
        },
        textColor: {
          color: "#ffffff",
        },
        borderColor: {
          borderColor: "#555",
        },
        iconColor: "#ffffff",
        backgroundStyle: {
          backgroundColor: "#000000",
        },
        verseContainerBg: "rgba(255, 255, 255, 0.1)",
        playButtonBg: "rgba(255, 255, 255, 0.2)",
        progressBg: "rgba(255, 255, 255, 0.1)",
        progressFill: "#ffffff",
      };
    } else {
      return {
        header: {
          backgroundColor: "transparent",
          borderBottomColor: "#d19a9c",
        },
        headerTitle: {
          color: "#5d0e0f",
        },
        backButton: {
          backgroundColor: "rgba(209, 154, 156, 0.5)",
          borderRadius: 20,
          padding: 8,
        },
        textColor: {
          color: "#5d0e0f",
        },
        borderColor: {
          borderColor: "#d19a9c",
        },
        iconColor: "#5d0e0f",
        backgroundStyle:
          currentTheme === "gradient" ? {} : { backgroundColor: "#fafafa" },
        verseContainerBg: "rgba(255, 255, 255, 0.3)",
        playButtonBg: "rgba(209, 154, 156, 0.3)",
        progressBg: "rgba(209, 154, 156, 0.1)",
        progressFill: "#5d0e0f",
      };
    }
  };

  const dynamicStyles = getDynamicStyles();

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Audio setup error:", error);
      }
    };

    setupAudio();

    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (!currentVerse?.audioUrl) return;

      const { sound: audioSound } = await Audio.Sound.createAsync(
        currentVerse.audioUrl,
        { shouldPlay: false },
        (status) => {
          if (status.isLoaded) {
            setDuration(
              status.durationMillis ? status.durationMillis / 1000 : 0
            );
            setPosition(
              status.positionMillis ? status.positionMillis / 1000 : 0
            );
            setIsPlaying(status.isPlaying || false);

            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
              progressAnim.setValue(0);
            }
          }
        }
      );

      setSound(audioSound);
    } catch (error) {
      console.error("Error loading audio", error);
    }
  };

  const togglePlayback = async () => {
    try {
      if (!sound) {
        await loadAudio();
      }

      if (isPlaying) {
        await sound?.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound?.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  useEffect(() => {
    if (currentVerse?.audioUrl) {
      loadAudio();
    }
  }, [chapter, verse]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && sound) {
        sound.getStatusAsync().then((status) => {
          if (status.isLoaded && status.positionMillis) {
            const newPosition = status.positionMillis / 1000;
            setPosition(newPosition);
            progressAnim.setValue(newPosition / (status.durationMillis ? status.durationMillis / 1000 : 1));
          }
        });
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, sound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const navigateToVerse = (newChapter: number, newVerse: number) => {
    router.setParams({
      chapter: newChapter.toString(),
      verse: newVerse.toString()
    });
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setPosition(0);
    progressAnim.setValue(0);
  };

  const goToPreviousVerse = () => {
    if (currentIndex > 0) {
      const prevVerse = allVerses[currentIndex - 1];
      navigateToVerse(prevVerse.chapter, prevVerse.verse);
    }
  };

  const goToNextVerse = () => {
    if (currentIndex < allVerses.length - 1) {
      const nextVerse = allVerses[currentIndex + 1];
      navigateToVerse(nextVerse.chapter, nextVerse.verse);
    }
  };
  

  const renderContent = () => (
    
    <View style={[styles.container, dynamicStyles.backgroundStyle]}>
      <SafeAreaView
        edges={["top"]}
        style={{
          backgroundColor: "transparent",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={dynamicStyles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={dynamicStyles.iconColor}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>
            {book.title} {chapter}.{verse}
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View
            style={[styles.verseBorderDecoration, dynamicStyles.borderColor]}
          >
            <View style={[styles.verseInnerBorder, dynamicStyles.borderColor]}>
              <Text style={[styles.sanskritVerse, dynamicStyles.textColor]}>
                {currentVerse?.sanskrit || "Loading verse..."}
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, dynamicStyles.textColor]}>
            Transliteration
          </Text>
          <Text style={[styles.transliteration, dynamicStyles.textColor]}>
            {currentVerse?.transliteration || ""}
          </Text>

          <Text style={[styles.sectionTitle, dynamicStyles.textColor]}>
            Translation
          </Text>
          <Text style={[styles.translation, dynamicStyles.textColor]}>
            {currentVerse?.translation || ""}
          </Text>

          <Text style={[styles.sectionTitle, dynamicStyles.textColor]}>
            Commentary
          </Text>
          <Text style={[styles.commentary, dynamicStyles.textColor]}>
            {currentVerse?.commentary || ""}
          </Text>

          {/* Audio Player */}
          {currentVerse?.audioUrl && (
            <View style={styles.audioPlayerContainer}>
              <TouchableOpacity
                onPress={togglePlayback}
                style={[
                  styles.playButton,
                  { backgroundColor: dynamicStyles.playButtonBg },
                ]}
              >
                <MaterialCommunityIcons
                  name={isPlaying ? "pause" : "play"}
                  size={32}
                  color={dynamicStyles.iconColor}
                />
              </TouchableOpacity>

              <View 
                style={styles.progressContainer}
                ref={progressBarRef}
                collapsable={false}
              >
                <View 
                  style={[
                    styles.progressBackground,
                    { backgroundColor: dynamicStyles.progressBg },
                  ]}
                  {...panResponder.panHandlers}
                >
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: dynamicStyles.progressFill,
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={[styles.timeText, dynamicStyles.textColor]}>
                    {formatTime(position)}
                  </Text>
                  <Text style={[styles.timeText, dynamicStyles.textColor]}>
                    {formatTime(duration)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.navButtonsContainer}>
            <TouchableOpacity
              onPress={goToPreviousVerse}
              disabled={currentIndex === 0}
              style={[
                styles.navButton,
                dynamicStyles.borderColor,
                { 
                  backgroundColor: dynamicStyles.verseContainerBg,
                  opacity: currentIndex === 0 ? 0.5 : 1
                },
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={dynamicStyles.iconColor}
              />
              <Text style={[styles.navButtonText, dynamicStyles.textColor]}>
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goToNextVerse}
              disabled={currentIndex === allVerses.length - 1}
              style={[
                styles.navButton,
                dynamicStyles.borderColor,
                { 
                  backgroundColor: dynamicStyles.verseContainerBg,
                  opacity: currentIndex === allVerses.length - 1 ? 0.5 : 1
                },
              ]}
            >
              <Text style={[styles.navButtonText, dynamicStyles.textColor]}>
                Next
              </Text>
              <Ionicons
                name="arrow-forward"
                size={24}
                color={dynamicStyles.iconColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  if (currentTheme === "gradient") {
    return (
      <>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent={true}
        />
        <GradientBackground>{renderContent()}</GradientBackground>
      </>
    );
  }

  return (
    <>
      <StatusBar
        backgroundColor={currentTheme === "dark" ? "#000000" : "#fafafa"}
        barStyle={currentTheme === "dark" ? "light-content" : "dark-content"}
        translucent={false}
      />
      {renderContent()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
    borderBottomWidth: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    fontFamily: "serif",
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  contentWrapper: {
    paddingHorizontal: 20,
  },
  verseBorderDecoration: {
    width: "100%",
    marginVertical: 20,
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  verseInnerBorder: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 4,
    padding: 15,
  },
  sanskritVerse: {
    fontSize: 22,
    lineHeight: 36,
    textAlign: "center",
    fontFamily: "serif",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    fontFamily: "serif",
  },
  transliteration: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "sans-serif",
    fontStyle: "italic",
    marginBottom: 15,
  },
  translation: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "serif",
    marginBottom: 15,
  },
  commentary: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: "serif",
  },
  audioPlayerContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  progressContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  progressBackground: {
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  progressFill: {
    height: "100%",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  timeText: {
    fontSize: 14,
    fontFamily: "serif",
  },
  navButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontFamily: "serif",
  },
});