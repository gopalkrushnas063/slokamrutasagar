import { Tabs } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const theme = useTheme();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  
  // Tab bar colors based on theme
  const tabBarStyle = {
    backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    borderTopColor: currentTheme === 'dark' ? '#333' : '#e0e0e0',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  };

  const tabBarActiveTintColor = currentTheme === 'gradient' ? '#FFA500' : 
                               currentTheme === 'dark' ? '#FFA500' : '#007AFF';
  
  const tabBarInactiveTintColor = currentTheme === 'dark' ? '#666' : '#999';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmark',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'bookmark' : 'bookmark-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}