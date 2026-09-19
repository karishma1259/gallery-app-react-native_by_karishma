import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';

const IS_WEB = Platform.OS === 'web';

export default function App() {
  useEffect(() => {
    if (IS_WEB) {
      const html = document.documentElement;
      const body = document.body;
      const root = document.getElementById('root');
      [html, body, root].forEach((el) => {
        if (el) {
          el.style.height = '100%';
          el.style.margin = '0';
        }
      });
    }
  }, []);

  const content = (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  // On web, show the app centered inside a phone-sized frame instead of
  // stretching across the whole browser window — much closer to how it
  // will actually look on a device, and avoids needing to zoom out.
  if (IS_WEB) {
    return (
      <View style={styles.webBackdrop}>
        <View style={styles.webPhoneFrame}>{content}</View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  webBackdrop: {
    flex: 1,
    minHeight: '100vh' as any,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    padding: 20,
    overflow: 'auto' as any,
  },
    webPhoneFrame: {
    width: 560,
    maxWidth: '100%',
    height: '95vh' as any,
    maxHeight: 980,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 8,
    borderColor: '#1F2937',
  },
});