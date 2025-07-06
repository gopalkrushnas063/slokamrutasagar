import { Stack } from "expo-router";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "../src/context/ThemeContext";
import {
  checkAppUpdate,
  showUpdateAlert,
  UpdateType,
} from "../src/services/appUpdateService";
import { persistor, store } from "../src/store";

export default function RootLayout() {
  useEffect(() => {
    const checkUpdates = async () => {
      const updateType = await checkAppUpdate();

      if (updateType !== UpdateType.NONE) {
        const response = await fetch(
          "https://gopalkrushnas063.github.io/mo_gapa_bahi_json/appUpdate.json"
        );
        const updateConfig = await response.json();
        showUpdateAlert(updateType, updateConfig);
      }
    };

    checkUpdates();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pages/bookdetails" />
            <Stack.Screen name="pages/reading" />
          </Stack>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
