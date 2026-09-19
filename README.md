# GalleryApp — React Native Intern Assignment

A React Native (Expo + TypeScript) app implementing user authentication,
an image gallery dashboard (Picsum Photos API), favorites, and profile
management.

## Setup & Running Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Metro bundler:
   ```bash
   npx expo start
   ```
3. Run on a device/emulator:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)
   - Or scan the QR code with the **Expo Go** app on a physical phone

### Building an APK

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## Key Libraries Used

| Library | Purpose |
|---|---|
| `@react-navigation/*` | Stack + bottom-tab navigation |
| `zustand` | Centralized state management (auth store, gallery store) |
| `@react-native-async-storage/async-storage` | Local persistence (users, session, favorites) |
| `axios` | API requests to Picsum |
| `expo-media-library` / `expo-file-system` | Downloading images to device gallery |
| `expo-sharing` | Sharing image links |
| `@react-native-picker/picker` | City dropdown, in the registration form |

## Folder Structure

```
src/
├── api/            # Picsum API service calls
├── components/     # Reusable UI (Button, InputField, ImageCard, Dropdown, LoadingSpinner)
├── hooks/           # useFetchImages (pagination), useDebounce, useAuth
├── navigation/      # AuthNavigator, MainTabNavigator, RootNavigator
├── screens/
│   ├── Auth/         # Login, Register
│   └── Main/         # Home, Favorites, ImageDetail, Profile
├── store/           # useAuthStore, useGalleryStore (Zustand)
├── types/           # TypeScript interfaces
└── utils/           # storage.ts (AsyncStorage wrapper), validation.ts
```

## Architecture & Assumptions

- **Auth**: Registered users are stored as an array under a single
  AsyncStorage key. Login checks credentials against that array. Session
  is persisted by storing the logged-in user's email; `RootNavigator`
  rehydrates on app start and swaps between the Auth stack and the Main
  tabs automatically.
- **Passwords** are stored in plain text in AsyncStorage for the scope of
  this assignment. In a production app these would never be stored
  client-side unhashed — this would go through a real backend with
  hashing.
- **State management**: Zustand was chosen over Context API/Redux for its
  minimal boilerplate while still being centralized and scalable ( no
  prop drilling, selectors avoid unnecessary re-renders).
- **Search & Filter**: Combined via a single `useMemo` in `HomeScreen`
  operating on the currently loaded pages of images, so search, the A-M/
  N-Z filter, and pagination all work together without conflicting.
- **Debounced search**: `useDebounce` (400ms) prevents excessive
  re-filtering while typing.
- **Pagination**: `useFetchImages` uses a `useRef` guard (`isFetchingRef`)
  so pull-to-refresh and `onEndReached` can never trigger overlapping
  duplicate network requests.
- **Favorites**: Stored under their own AsyncStorage key, synced on every
  toggle, and shared between the Home and Favorites screens via the
  `useGalleryStore` Zustand store — so state is consistent across screens
  without re-fetching.
- **Image Detail / Download**: Uses `expo-file-system` to download the
  full-resolution image to a temp cache path, then `expo-media-library`
  to save it into a "GalleryApp" album on the device.

## Known Follow-ups / Bonus Items Not Yet Implemented

These are called out per the assignment's "document your assumptions"
requirement — they were left as extension points given the scaffold's
scope:
- Avatar selection on Profile screen
- Dark mode theming
- Unit tests for hooks/validation
- Sort options beyond A-M / N-Z filter

## Notes for the Candidate Building This Out Further

This repository is a working scaffold that satisfies the mandatory
requirements end-to-end (register → login → session persistence → browse/
search/filter/paginate → favorite → view detail → download → edit
profile → logout). Before submitting:
1. Run `npx expo start` and click through every flow once.
2. Add a `.gitignore`-respecting `git init` + push to a fresh GitHub repo.
3. Generate and attach the APK per the build command above.
4. Optionally tackle the bonus features listed in the assignment PDF.
