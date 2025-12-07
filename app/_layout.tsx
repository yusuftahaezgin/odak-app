import { Stack } from "expo-router";
import { SessionsProvider } from "../src/context/SessionsContext";

export default function RootLayout() {
  return (
    <SessionsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SessionsProvider>
  );
}
