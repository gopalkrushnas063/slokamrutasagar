import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { useTheme } from "../../src/context/ThemeContext";
import { RootState } from "../../src/store";

export default function TabLayout() {
  const theme = useTheme();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  // Tab bar colors based on theme
  const tabBarStyle = {
    backgroundColor: currentTheme === "dark" ? "#1a1a1a" : "#ffffff",
    borderTopColor: currentTheme === "dark" ? "#333" : "#e0e0e0",
    borderTopWidth: 1,
    height: 100,
    paddingBottom: 8,
    paddingTop: 8,
  };

  const tabBarActiveTintColor =
    currentTheme === "gradient"
      ? "#922033"
      : currentTheme === "dark"
      ? "#FFA500"
      : "#007AFF";

  const tabBarInactiveTintColor = currentTheme === "dark" ? "#666" : "grey";

  // Custom tab bar background component for gradient theme
  const TabBarBackground = () => {
    if (currentTheme === "gradient") {
      return (
        <LinearGradient
          colors={["#fafafa", "#d19a9c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            borderTopWidth: 0,
          }}
        />
      );
    }
    return null;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: currentTheme === "gradient" ? 
          {
            ...tabBarStyle,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          } : tabBarStyle,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarBackground: () => <TabBarBackground />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Bookmark",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}