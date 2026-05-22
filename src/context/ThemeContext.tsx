import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'light';
  isDarkMode: boolean;
  setTheme: (theme: 'light') => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#00704A',
  background: '#FFFFFF',
  surface: '#F2F0EB',
  text: '#1E3932',
  textSecondary: '#4A4A4A',
  placeholder: '#AAAAAA',
  border: '#D4E9E2',
  error: '#C0392B',
  success: '#00704A',
  warning: '#D4AC16',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{
      theme: 'light',
      isDarkMode: false,
      setTheme: () => {},
      colors: lightColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};