import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, FlatList } from "react-native";
import { useTheme } from '../../src/context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { GradientBackground } from '../../src/styles/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface BookmarkItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function BookmarkScreen() {
  const theme = useTheme();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: '1',
      title: 'Getting Started Guide',
      description: 'Learn how to use all the features of this app',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Theme Customization',
      description: 'Tips for customizing your app theme',
      date: '2024-01-14'
    },
    {
      id: '3',
      title: 'Advanced Settings',
      description: 'Explore advanced configuration options',
      date: '2024-01-13'
    }
  ]);

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(item => item.id !== id));
  };

  const renderBookmarkItem = ({ item }: { item: BookmarkItem }) => (
    <View style={[styles.bookmarkItem, { 
      backgroundColor: currentTheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
      borderColor: currentTheme === 'dark' ? '#444' : '#ddd'
    }]}>
      <View style={{ flex: 1 }}>
        <Text style={[theme.text, { fontSize: 16, fontWeight: '600', marginBottom: 5 }]}>
          {item.title}
        </Text>
        <Text style={[theme.text, { opacity: 0.7, marginBottom: 8 }]}>
          {item.description}
        </Text>
        <Text style={[theme.text, { opacity: 0.5, fontSize: 12 }]}>
          {item.date}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removeBookmark(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => (
    <SafeAreaView style={[theme.container, { flex: 1 }]}>
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={[theme.text, { fontSize: 28, fontWeight: 'bold', marginBottom: 20 }]}>
          Bookmarks 📚
        </Text>
        
        {bookmarks.length > 0 ? (
          <FlatList
            data={bookmarks}
            renderItem={renderBookmarkItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="bookmark-outline" 
              size={64} 
              color={theme.text.color} 
              style={{ opacity: 0.3 }} 
            />
            <Text style={[theme.text, { textAlign: 'center', marginTop: 20, opacity: 0.7 }]}>
              No bookmarks yet
            </Text>
            <Text style={[theme.text, { textAlign: 'center', marginTop: 10, opacity: 0.5 }]}>
              Your saved items will appear here
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  if (currentTheme === 'gradient') {
    return <GradientBackground>{renderContent()}</GradientBackground>;
  }

  return renderContent();
}

const styles = {
  bookmarkItem: {
    flexDirection: 'row' as const,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center' as const,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  }
};