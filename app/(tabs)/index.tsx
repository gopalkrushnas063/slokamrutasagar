import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../src/context/ThemeContext";
import { RootState } from "../../src/store";
import { toggleTheme } from "../../src/store/slices/themeSlice";
import { GradientBackground } from "../../src/styles/themes";

const { width } = Dimensions.get("window");

// Sample carousel data
const carouselData = [
  {
    id: "1",
    title: "Bhagavad Gita",
    subtitle: "Divine Wisdom",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop", // Replace with your images
  },
  {
    id: "2",
    title: "Vedic Mantras",
    subtitle: "Sacred Sounds",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
  },
  {
    id: "3",
    title: "Krishna Stories",
    subtitle: "Divine Tales",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
  },
];

// Categories data
const categories = [
  { id: "all", name: "All", icon: "grid-outline" },
  { id: "shlokas", name: "Shlokas", icon: "library-outline" },
  { id: "vedas", name: "Vedas", icon: "book-outline" },
  { id: "bhagbat", name: "Bhagbat", icon: "heart-outline" },
  { id: "stories", name: "Stories", icon: "chatbubbles-outline" },
  { id: "mantras", name: "Mantras", icon: "musical-notes-outline" },
];

// Sample books data
const booksData = [
  {
    id: "1",
    title: "Bhagavad Gita Chapter 1",
    category: "shlokas",
    author: "Krishna",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=200&fit=crop",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Rig Veda Mantras",
    category: "vedas",
    author: "Ancient Sages",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=200&fit=crop",
    rating: 4.9,
  },
  {
    id: "3",
    title: "Krishna Leela",
    category: "stories",
    author: "Vyasa",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=200&fit=crop",
    rating: 4.7,
  },
  {
    id: "4",
    title: "Srimad Bhagbatam",
    category: "bhagbat",
    author: "Vyasa",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=200&fit=crop",
    rating: 4.9,
  },
  {
    id: "5",
    title: "Gayatri Mantra",
    category: "mantras",
    author: "Vishwamitra",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=200&fit=crop",
    rating: 4.8,
  },
  {
    id: "6",
    title: "Hanuman Chalisa",
    category: "shlokas",
    author: "Tulsidas",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=200&fit=crop",
    rating: 4.9,
  },
  {
    id: "7",
    title: "Ramayana Stories",
    category: "stories",
    author: "Valmiki",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=200&fit=crop",
    rating: 4.8,
  },
  {
    id: "8",
    title: "Sama Veda",
    category: "vedas",
    author: "Ancient Sages",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=200&fit=crop",
    rating: 4.7,
  },
  {
    id: "9",
    title: "Vishnu Sahasranamam",
    category: "shlokas",
    author: "Vyasa",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=200&fit=crop",
    rating: 4.9,
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const carouselRef = useRef<FlatList>(null);

  // Filter books based on selected category
  const filteredBooks =
    selectedCategory === "all"
      ? booksData
      : booksData.filter((book) => book.category === selectedCategory);

  // Carousel item renderer
  const renderCarouselItem = ({ item }: { item: (typeof carouselData)[0] }) => (
    <View style={styles.carouselItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
      <View style={styles.carouselOverlay}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  // Carousel pagination dots
  const renderCarouselDots = () => (
    <View style={styles.dotsContainer}>
      {carouselData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentCarouselIndex
                  ? "#FFA500"
                  : "rgba(255, 255, 255, 0.5)",
            },
          ]}
        />
      ))}
    </View>
  );

  // Category item renderer
  const renderCategoryItem = ({ item }: { item: (typeof categories)[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor:
            selectedCategory === item.id
              ? currentTheme === "dark"
                ? "#FFA500"
                : "#e0b5b6"
              : currentTheme === "dark"
              ? "#2a2a2a"
              : "rgba(255, 255, 255, 0.8)",
          borderColor: selectedCategory === item.id ? currentTheme === "dark"
              ? "#FFA500" : "#c07e7e" : "transparent",
        },
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={20}
        color={selectedCategory === item.id ? "#fff" : theme.text.color}
      />
      <Text
        style={[
          styles.categoryText,
          {
            color: selectedCategory === item.id ? "#fff" : theme.text.color,
            fontWeight: selectedCategory === item.id ? "bold" : "normal",
          },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Book item renderer
  const renderBookItem = ({ item }: { item: (typeof booksData)[0] }) => (
    <TouchableOpacity
      style={[
        styles.bookItem,
        {
          backgroundColor:
            currentTheme === "dark" ? "#2a2a2a" : "rgba(255, 255, 255, 0.9)",
          shadowColor: currentTheme === "dark" ? "#000" : "#000",
        },
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.bookImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["#fafafa", "#d19a9c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bookInfo}
      >
        <Text style={[styles.bookTitle, { color: "#333" }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: "#555" }]} numberOfLines={1}>
          {item.author}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text style={[styles.rating, { color: "#333" }]}>{item.rating}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Handle carousel scroll
  const onCarouselViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentCarouselIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderContent = () => (
    <SafeAreaView edges={["top"]} style={[theme.container, { flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[theme.text, styles.greeting]}>🙏 Namaste</Text>
            <Text style={[theme.text, styles.headerTitle]}>
              Spiritual Journey
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.themeButton,
              {
                backgroundColor:
                  currentTheme === "dark" ? "#333" : "rgba(255, 255, 255, 0.8)",
              },
            ]}
            onPress={() => dispatch(toggleTheme())}
          >
            <Ionicons
              name={currentTheme === "dark" ? "sunny" : "moon"}
              size={24}
              color={theme.text.color}
            />
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={carouselRef}
            data={carouselData}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onViewableItemsChanged={onCarouselViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
          {renderCarouselDots()}
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={[theme.text, styles.sectionTitle]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Books Grid */}
        <View style={styles.booksContainer}>
          {/* <View style={styles.booksHeader}>
            <Text style={[theme.text, styles.sectionTitle]}>
              {selectedCategory === "all"
                ? "All Books"
                : `${
                    categories.find((cat) => cat.id === selectedCategory)?.name
                  } Books`}
            </Text>
            <Text style={[theme.text, styles.booksCount]}>
              {filteredBooks.length} books
            </Text>
          </View> */}
          <FlatList
            data={filteredBooks}
            renderItem={renderBookItem}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.booksGrid}
            columnWrapperStyle={styles.bookRow}
            scrollEnabled={false}
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

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  themeButton: {
    padding: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carouselContainer: {
    marginBottom: 30,
  },
  carouselItem: {
    width: width - 40,
    height: 180,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  carouselSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  booksContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  booksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  booksCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  booksGrid: {
    paddingBottom: 20,
  },
  bookRow: {
    justifyContent: "space-between",
  },
  bookItem: {
    flex: 1,
    maxWidth: "48%" as any,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  bookImage: {
    width: "100%" as any,
    height: 120,
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    lineHeight: 18,
  },
  bookAuthor: {
    fontSize: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
});
