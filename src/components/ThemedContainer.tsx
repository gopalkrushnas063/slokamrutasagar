// app/ThemedContainer.tsx
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { darkTheme, GradientBackground } from "../styles/themes";

export const ThemedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  if (currentTheme === "gradient") {
    return <GradientBackground>{children}</GradientBackground>;
  }

  return <View style={darkTheme.container}>{children}</View>;
};
