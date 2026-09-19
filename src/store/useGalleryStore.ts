import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { PicsumImage, FavoriteImage } from '@/types/gallery';

interface GalleryState {
  favorites: FavoriteImage[];
  isFavoritesHydrated: boolean;

  loadFavorites: () => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  favorites: [],
  isFavoritesHydrated: false,

  loadFavorites: async () => {
    const saved = (await storage.getItem<FavoriteImage[]>(STORAGE_KEYS.FAVORITES)) ?? [];
    set({ favorites: saved, isFavoritesHydrated: true });
  },

  toggleFavorite: async (image) => {
    const current = get().favorites;
    const exists = current.some((f) => f.id === image.id);

    const updated = exists
      ? current.filter((f) => f.id !== image.id)
      : [...current, { ...image, favoritedAt: Date.now() }];

    set({ favorites: updated });
    await storage.setItem(STORAGE_KEYS.FAVORITES, updated);
  },

  isFavorite: (id) => get().favorites.some((f) => f.id === id),
}));
