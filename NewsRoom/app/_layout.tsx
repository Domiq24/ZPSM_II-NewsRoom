import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {Grenze_300Light, Grenze_300Light_Italic, Grenze_400Regular, Grenze_700Bold, useFonts} from "@expo-google-fonts/grenze";
import JWT from "expo-jwt";
import {useEffect} from "react";
import { useRootNavigationState, useRouter } from "expo-router";
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const navigatorReady = rootNavigationState?.key != null;

    useFonts({
        Grenze_300Light,
        Grenze_300Light_Italic,
        Grenze_400Regular,
        Grenze_700Bold
    })

    useEffect(() => {
        if (navigatorReady) {
            router.replace("/login");
        }
    }, [navigatorReady, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
          initialRouteName="login"
          screenOptions={{
              headerTitleStyle: {fontFamily: 'Grenze_700Bold', fontSize: 28}
          }}
      >
        <Stack.Screen name="login" options={{title: 'Log in'}} />
        <Stack.Screen name="signup" options={{title: 'Sign up'}} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="details" options={{ presentation: 'modal', title: 'Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
