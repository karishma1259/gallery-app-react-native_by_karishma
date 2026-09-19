import { PicsumImage } from './gallery';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Stack that wraps the tabs, so we can push Detail on top of any tab
export type RootStackParamList = {
  MainTabs: undefined;
  ImageDetail: { image: PicsumImage };
};

export type RootNavigatorParamList = {
  Auth: undefined;
  App: undefined;
};
