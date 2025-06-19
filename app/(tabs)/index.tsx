import React from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useTheme } from '../../src/context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { toggleTheme, setTheme } from '../../src/store/slices/themeSlice';
import { GradientBackground } from '../../src/styles/themes';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

  const renderContent = () => (
    <SafeAreaView style={[theme.container, { flex: 1 }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[theme.text, { fontSize: 28, fontWeight: 'bold', marginBottom: 20 }]}>
          Welcome Home! 🏠
        </Text>
        
        <Text style={[theme.text, { marginBottom: 20 }]}>
          Current theme: {currentTheme}
        </Text>
        
        <View style={{ gap: 15 }}>
          <TouchableOpacity
            style={theme.button}
            onPress={() => dispatch(toggleTheme())}
          >
            <Text style={theme.buttonText}>Toggle Theme</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={theme.button}
            onPress={() => dispatch(setTheme('dark'))}
          >
            <Text style={theme.buttonText}>Set Dark Theme</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={theme.button}
            onPress={() => dispatch(setTheme('gradient'))}
          >
            <Text style={theme.buttonText}>Set Gradient Theme</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={[theme.text, { fontSize: 18, fontWeight: '600', marginBottom: 10 }]}>
            Quick Actions
          </Text>
          <Text style={[theme.text, { opacity: 0.7 }]}>
            Use the bottom tabs to navigate between Home, Bookmarks, and Settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  if (currentTheme === 'gradient') {
    return <GradientBackground>{renderContent()}</GradientBackground>;
  }

  return renderContent();
}