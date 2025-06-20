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
// const carouselData = [
//   {
//     id: "1",
//     title: "Bhagavad Gita",
//     subtitle: "Divine Wisdom",
//     image:
//       "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop", // Replace with your images
//   },
//   {
//     id: "2",
//     title: "Vedic Mantras",
//     subtitle: "Sacred Sounds",
//     image:
//       "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
//   },
//   {
//     id: "3",
//     title: "Krishna Stories",
//     subtitle: "Divine Tales",
//     image:
//       "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
//   },
// ];

// Categories data
const categories = [
  { id: "all", name: "All", icon: "grid-outline" },
  { id: "shlokas", name: "Shlokas", icon: "library-outline" },
  { id: "vedas", name: "Vedas", icon: "book-outline" },
  { id: "bhagbat", name: "Bhagbat", icon: "heart-outline" },
  { id: "stories", name: "Stories", icon: "chatbubbles-outline" },
  { id: "mantras", name: "Mantras", icon: "musical-notes-outline" },
];

const carouselData = [
  {
    id: "1",
    title1: "On the Ornament of Speech",
    title2: "On the True Self",
    content:
      "Lorem ipsum dolor sit amet consectetur. Mollis enim vulputate turpis proin fames dolor. Vivamus maecenas ullamcorper scelerisque arcu egestas nisi vitae velit. Mauris ipsum libero etiam urna non consequat vel.",
  },
  {
    id: "2",
    title1: "On the True Self",
    content:
      "Lorem ipsum dolor sit amet consectetur. Mollis enim vulputate turpis proin fames dolor. Vivamus maecenas ullamcorper scelerisque arcu egestas nisi vitae velit. Mauris ipsum libero etiam urna non consequat vel.",
  },
  // Add more if needed
];

// Sample books data
const booksData = [
  {
    id: "1",
    title: "Bhagavad Gita Chapter 1",
    category: "shlokas",
    author: "Krishna",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.8,
  },
  {
    id: "2",
    title: "Rig Veda Mantras\n",
    category: "vedas",
    author: "Ancient Sages",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.9,
  },
  {
    id: "3",
    title: "Krishna Leela",
    category: "stories",
    author: "Vyasa",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.7,
  },
  {
    id: "4",
    title: "Srimad Bhagbatam",
    category: "bhagbat",
    author: "Vyasa",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.9,
  },
  {
    id: "5",
    title: "Gayatri Mantra",
    category: "mantras",
    author: "Vishwamitra",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.8,
  },
  {
    id: "6",
    title: "Hanuman Chalisa",
    category: "shlokas",
    author: "Tulsidas",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.9,
  },
  {
    id: "7",
    title: "Ramayana Stories",
    category: "stories",
    author: "Valmiki",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.8,
  },
  {
    id: "8",
    title: "Sama Veda",
    category: "vedas",
    author: "Ancient Sages",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
    rating: 4.7,
  },
  {
    id: "9",
    title: "Vishnu Sahasranamam",
    category: "shlokas",
    author: "Vyasa",
    image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
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
  // const renderCarouselItem = ({ item }: { item: (typeof carouselData)[0] }) => (
  //   <View style={styles.carouselItem}>
  //     <Image
  //       source={{ uri: item.image }}
  //       style={styles.carouselImage}
  //       resizeMode="cover"
  //     />
  //     <View style={styles.carouselOverlay}>
  //       <Text style={styles.carouselTitle}>{item.title}</Text>
  //       <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
  //     </View>
  //   </View>
  // );
  const renderCarouselItem = ({ item }: { item: (typeof carouselData)[0] }) => (
    <View
      style={[
        styles.carouselCard,
        {
          backgroundColor: currentTheme == "dark" ? "#1e1e1e" : "#ffffff",
          shadowColor: currentTheme == "dark" ? "#000" : "#aaa",
        },
      ]}
    >
      {/* Watermark at center */}
      <Image
        source={require("@/assets/images/m1.png")}
        style={[
          styles.watermarkImage,
          currentTheme === "dark"
            ? { tintColor: "#ffffff" }
            : { tintColor: "#922033" },
        ]}
        resizeMode="contain"
      />

      <Ionicons
        name="pause-outline"
        size={40}
        color="#fbc6b4"
        style={styles.quoteIconTop}
      />

      {item.title1 && (
        <Text
          style={[
            styles.quoteTitle1,
            { color: currentTheme === "dark" ? "#ffffff" : "#222222" },
          ]}
        >
          {item.title1}
        </Text>
      )}
      {item.title2 && (
        <Text
          style={[
            styles.quoteTitle2,
            { color: currentTheme === "dark" ? "#ffffff" : "#222222" },
          ]}
        >
          {item.title2}
        </Text>
      )}
      <Text
        style={[
          styles.quoteContent,
          { color: currentTheme === "dark" ? "#ffffff" : "#222222" },
        ]}
      >
        {item.content}
      </Text>

      {item.title2 && (
        <>
          <View style={styles.divider} />
          <Text
            style={[
              styles.quoteTitle2,
              { color: currentTheme === "dark" ? "#ffffff" : "#222222" },
            ]}
          >
            {item.title2}
          </Text>
          <Text
            style={[
              styles.quoteContent,
              { color: currentTheme === "dark" ? "#ffffff" : "#222222" },
            ]}
          >
            {item.content}
          </Text>
        </>
      )}

      <Ionicons
        name="pause-outline"
        size={40}
        color="#fbc6b4"
        style={styles.quoteIconBottom}
      />
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
                  ? currentTheme == "dark"
                    ? "#FFA500"
                    : "#922033"
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
          borderColor:
            selectedCategory === item.id
              ? currentTheme === "dark"
                ? "#FFA500"
                : "#c07e7e"
              : "transparent",
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
      onPress={() =>
        router.push({
          pathname: "/pages/bookdetails",
          params: { id: item.id },
        })
      }
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
        source={item.image} // This is now a local require
        style={styles.bookImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={
          currentTheme === "dark"
            ? ["#333", "#444"] // Dark mode gradient colors
            : ["#fafafa", "#d19a9c"] // Light mode gradient colors
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bookInfo}
      >
        {/* Corner Image - Right Edge Aligned */}
        <View style={styles.cornerImageWrapper}>
          <Image
            source={require("@/assets/images/yoga-half-mandala.png")}
            style={[
              styles.cornerImage,
              currentTheme === "dark"
                ? { tintColor: "#ffffff" }
                : { tintColor: "#922033" },
            ]}
            resizeMode="contain"
          />
        </View>

        <Text
          style={[
            styles.bookTitle,
            { color: currentTheme === "dark" ? "#eee" : "#333" },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.bookAuthor,
            { color: currentTheme === "dark" ? "#ccc" : "#555" },
          ]}
          numberOfLines={1}
        >
          {item.author}
        </Text>

        <View style={styles.bookmarkContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFA500" />
            <Text
              style={[
                styles.rating,
                { color: currentTheme === "dark" ? "#eee" : "#333" },
              ]}
            >
              {item.rating}
            </Text>
          </View>
          <Ionicons
            name="bookmarks"
            size={15}
            color={currentTheme === "dark" ? "#FFA500" : "#922033"}
          />
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
            <Text style={[theme.text, styles.greeting]}>
              {t("home.greeting")}
            </Text>
            <Text style={[theme.text, styles.headerTitle]}>
              {t("home.title")}
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
          <Text style={[theme.text, styles.sectionTitle]}>
            {t("home.categories")}
          </Text>

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
import { router } from "expo-router";
import { t } from "i18next";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    top: 0,
    right: 0,
    alignSelf: "center",
    width: 220,
    height: 100,
    opacity: 0.3,
  },
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
  carouselCard: {
    width: width - 40,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
    overflow: "hidden", // ✨ Clip watermark overflow
  },

  quoteIconTop: {
    position: "absolute",
    top: 10,
    left: 10,
    opacity: 0.3,
  },

  quoteIconBottom: {
    position: "absolute",
    bottom: 10,
    right: 10,
    opacity: 0.3,
  },
  watermarkImage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 250,
    height: 250,
    opacity: 0.2,
    transform: [
      { translateX: -100 }, // half of width
      { translateY: -100 }, // half of height
    ],
  },

  quoteTitle1: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#333",
  },

  quoteTitle2: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    color: "#444",
  },

  quoteContent: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
    lineHeight: 20,
  },

  divider: {
    height: 2,
    width: 60,
    backgroundColor: "#f06000",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 2,
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
    maxWidth: "48%",
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden", // Important for containing absolute positioned elements
  },
  bookInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    position: "relative", // Needed for absolute positioning of children
  },
  cornerImageWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 90, // Adjust as needed
    height: 70, // Adjust as needed
    marginRight: -30, // Pulls the image to the edge
    // marginTop: 5,
  },
  cornerImage: {
    width: "100%",
    height: "100%",
  },
  bookImage: {
    width: "100%",
    height: 120,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    lineHeight: 18,
    color: "#333",
  },
  bookAuthor: {
    fontSize: 12,
    marginBottom: 8,
    color: "#555",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookmarkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
    color: "#333",
  },
});
