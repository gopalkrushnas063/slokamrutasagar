import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { darkTheme, gradientTheme } from '../styles/themes';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const theme = currentTheme === 'dark' ? darkTheme : gradientTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};