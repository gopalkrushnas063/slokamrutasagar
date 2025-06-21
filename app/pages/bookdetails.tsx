import RectangularMandalaBorder from "@/src/components/decorative/RectangularMandalaBorder";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
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


const windowWidth = Dimensions.get("window").width;

export default function BookDetailsScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  const book = getLocalizedBookData(id as string);
  const allVerses = getAllVerses(book);

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
        readButtonBg: "rgba(255, 255, 255, 0.2)",
        borderDecorationBg: "rgba(255, 255, 255, 0.05)",
        innerBorderBg: "rgba(255, 255, 255, 0.1)",
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
        readButtonBg: "rgba(209, 154, 156, 0.3)",
        borderDecorationBg: "rgba(255, 255, 255, 0.5)",
        innerBorderBg: "rgba(255, 255, 255, 0.3)",
      };
    }
  };

  const dynamicStyles = getDynamicStyles();

  const renderVerseItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/pages/reading",
          params: {
            id: book.id,
            chapter: item.chapter,
            verse: item.verse,
          },
        })
      }
      style={[styles.verseItemContainer, dynamicStyles.borderColor]}
    >
      <View style={styles.verseHeader}>
        <Text style={[styles.verseNumber, dynamicStyles.textColor]}>
          Slok {item.chapter}.{item.verse}
        </Text>
        <View style={styles.separatorLine} />
      </View>
      <Text style={[styles.verseText, dynamicStyles.textColor]}>
        {item.sanskrit.split('\n')[0]}...
      </Text>
    </TouchableOpacity>
  );

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
            {book.title}
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.borderDecoration,
            dynamicStyles.borderColor,
            { backgroundColor: dynamicStyles.borderDecorationBg },
          ]}
        >
          <RectangularMandalaBorder
            width={windowWidth - 40}
            height={300}
            color={dynamicStyles.iconColor}
            strokeWidth={1.5}
            cornerRadius={8}
          />

          <View
            style={[
              styles.innerBorder,
              dynamicStyles.borderColor,
              { backgroundColor: dynamicStyles.innerBorderBg },
            ]}
          >
            <Image
              source={book.image}
              style={styles.bookCover}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <Text style={[styles.bookTitle, dynamicStyles.textColor]}>
            {book.title}
          </Text>
          {book.chapters[0] && (
            <Text style={[styles.bookSubtitle, dynamicStyles.textColor]}>
              {book.chapters[0].title} (Chapter 1)
            </Text>
          )}

          <View style={[styles.divider, dynamicStyles.borderColor]} />

          <Text style={[styles.bookAuthor, dynamicStyles.textColor]}>
            {book.author}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="book" size={18} color={dynamicStyles.iconColor} />
              <Text style={[styles.detailText, dynamicStyles.textColor]}>
                {book.chapters.length} Chapters
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="star" size={18} color={dynamicStyles.iconColor} />
              <Text style={[styles.detailText, dynamicStyles.textColor]}>
                {book.rating}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="language"
                size={18}
                color={dynamicStyles.iconColor}
              />
              <Text style={[styles.detailText, dynamicStyles.textColor]}>
                {book.language}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="list" size={18} color={dynamicStyles.iconColor} />
              <Text style={[styles.detailText, dynamicStyles.textColor]}>
                {book.chapters.reduce((acc, ch) => acc + ch.verseCount, 0)} Verses
              </Text>
            </View>
          </View>

          <View style={[styles.divider, dynamicStyles.borderColor]} />

          <Text style={[styles.sectionTitle, dynamicStyles.textColor]}>
            Chapter Summary
          </Text>

          <View
            style={[
              styles.verseContainer,
              dynamicStyles.borderColor,
              { backgroundColor: dynamicStyles.verseContainerBg },
            ]}
          >
            <FlatList
              data={allVerses.slice(0, 5)}
              renderItem={renderVerseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/pages/reading",
                params: {
                  id: book.id,
                  chapter: 1,
                  verse: 1,
                },
              })
            }
            style={[
              styles.readButton,
              {
                backgroundColor: dynamicStyles.readButtonBg,
                borderColor: dynamicStyles.borderColor.borderColor,
              },
            ]}
          >
            <Text style={[styles.readButtonText, dynamicStyles.textColor]}>
              Start Reading
            </Text>
            <Ionicons name="book" size={20} color={dynamicStyles.iconColor} />
          </TouchableOpacity>
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
    alignItems: "center",
  },
  borderDecoration: {
    width: windowWidth - 40,
    height: 300,
    marginVertical: 20,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  innerBorder: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  bookCover: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "serif",
  },
  bookSubtitle: {
    fontSize: 18,
    marginBottom: 15,
    fontFamily: "serif",
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 18,
    marginVertical: 10,
    fontFamily: "serif",
    fontStyle: "italic",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    minWidth: "45%",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "serif",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 15,
    borderWidth: 0.5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    fontFamily: "serif",
    alignSelf: "flex-start",
  },
  verseItemContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  verseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif",
    marginRight: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#d19a9c",
    opacity: 0.5,
  },
  verseText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "serif",
  },
  verseContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  readButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 1,
  },
  readButtonText: {
    fontSize: 18,
    marginRight: 10,
    fontFamily: "serif",
  },
});