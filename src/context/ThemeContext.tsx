import React, { createContext, useContext } from 'react';
import { theme } from '../styles/theme';

interface ThemeContextType {
  currentTheme: typeof theme.light;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: theme.light,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentTheme = theme.light;

  return (
    <ThemeContext.Provider value={{ currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 