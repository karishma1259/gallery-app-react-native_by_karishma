import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Centralized AsyncStorage keys.
 * Keeping keys in one place avoids typos and makes storage usage auditable.
 */
export const STORAGE_KEYS = {
  REGISTERED_USERS: '@gallery_app/registered_users', // array of User
  SESSION: '@gallery_app/session', // logged-in user email
  FAVORITES: '@gallery_app/favorites', // array of FavoriteImage
} as const;

/**
 * Thin, typed wrapper around AsyncStorage so the rest of the app
 * never touches raw JSON.stringify/parse directly.
 */
export const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`storage.getItem failed for key "${key}":`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`storage.setItem failed for key "${key}":`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`storage.removeItem failed for key "${key}":`, error);
    }
  },
};
