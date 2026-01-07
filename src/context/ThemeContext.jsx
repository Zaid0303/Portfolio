import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, updateTheme } from '../firebase/firestoreServices';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default to dark
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load theme from localStorage first (for instant UI)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    setLoading(false);

    // Then try to load from Firebase
    loadThemeFromFirebase();
  }, []);

  const loadThemeFromFirebase = async () => {
    try {
      const result = await getSettings();
      if (result.success && result.data?.defaultTheme) {
        const firebaseTheme = result.data.defaultTheme;
        setTheme(firebaseTheme);
        localStorage.setItem('theme', firebaseTheme);
        document.documentElement.classList.toggle('dark', firebaseTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme from Firebase:', error);
    }
  };

  const toggleTheme = async (newTheme) => {
    const themeValue = newTheme || (theme === 'dark' ? 'light' : 'dark');
    setTheme(themeValue);
    localStorage.setItem('theme', themeValue);
    document.documentElement.classList.toggle('dark', themeValue === 'dark');
    
    // Save to Firebase (for admin control)
    try {
      await updateTheme(themeValue);
    } catch (error) {
      console.error('Error saving theme to Firebase:', error);
    }
  };

  const value = {
    theme,
    toggleTheme,
    loading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

