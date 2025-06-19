import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { store, persistor } from '../src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}