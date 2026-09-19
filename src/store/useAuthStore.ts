import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { User, PublicUser, RegisterFormValues, LoginFormValues } from '@/types/auth';

interface AuthState {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean; // true while checking for a saved session on app start

  register: (values: RegisterFormValues) => Promise<{ success: boolean; message?: string }>;
  login: (values: LoginFormValues) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateProfile: (updates: Partial<PublicUser>) => Promise<void>;
}

const toPublicUser = (user: User): PublicUser => {
  const { password, ...publicUser } = user;
  return publicUser;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: true,

  register: async (values) => {
    const existingUsers = (await storage.getItem<User[]>(STORAGE_KEYS.REGISTERED_USERS)) ?? [];

    const alreadyExists = existingUsers.some(
      (u) => u.email.toLowerCase() === values.email.toLowerCase()
    );
    if (alreadyExists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      gender: values.gender,
      mobile: values.mobile.trim(),
      address: values.address.trim(),
      city: values.city,
      password: values.password, // NOTE: plain text for assignment scope; a real app must hash this
    };

    const updatedUsers = [...existingUsers, newUser];
    await storage.setItem(STORAGE_KEYS.REGISTERED_USERS, updatedUsers);

    return { success: true };
  },

  login: async (values) => {
    const users = (await storage.getItem<User[]>(STORAGE_KEYS.REGISTERED_USERS)) ?? [];
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === values.email.trim().toLowerCase() &&
        u.password === values.password
    );

    if (!match) {
      return { success: false, message: 'Invalid email or password.' };
    }

    await storage.setItem(STORAGE_KEYS.SESSION, match.email);
    set({ user: toPublicUser(match), isAuthenticated: true });
    return { success: true };
  },

  logout: async () => {
    await storage.removeItem(STORAGE_KEYS.SESSION);
    set({ user: null, isAuthenticated: false });
  },

  loadSession: async () => {
    set({ isHydrating: true });
    const sessionEmail = await storage.getItem<string>(STORAGE_KEYS.SESSION);

    if (!sessionEmail) {
      set({ isHydrating: false });
      return;
    }

    const users = (await storage.getItem<User[]>(STORAGE_KEYS.REGISTERED_USERS)) ?? [];
    const match = users.find((u) => u.email === sessionEmail);

    if (match) {
      set({ user: toPublicUser(match), isAuthenticated: true, isHydrating: false });
    } else {
      // stale session pointing at a user that no longer exists
      await storage.removeItem(STORAGE_KEYS.SESSION);
      set({ user: null, isAuthenticated: false, isHydrating: false });
    }
  },

  updateProfile: async (updates) => {
    const current = get().user;
    if (!current) return;

    const users = (await storage.getItem<User[]>(STORAGE_KEYS.REGISTERED_USERS)) ?? [];
    const updatedUsers = users.map((u) =>
      u.email === current.email ? { ...u, ...updates } : u
    );
    await storage.setItem(STORAGE_KEYS.REGISTERED_USERS, updatedUsers);

    const updatedPublicUser = { ...current, ...updates };
    set({ user: updatedPublicUser });
  },
}));
