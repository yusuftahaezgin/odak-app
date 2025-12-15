// Stack: Ekranlar arasında "stack navigation" (sayfa sayfa ilerleme) mantığını kurar.
import { Stack } from "expo-router";

// SessionsProvider: Uygulama genelinde seans (sessions) verisini tutan global context.
import { SessionsProvider } from "../src/context/SessionsContext";

// RootLayout: Uygulamanın en üst layout bileşeni. Tüm ekranlar burada sarmalanır.
export default function RootLayout() {
  return (
    // SessionsProvider ile tüm uygulamayı sardık. Böylece bütün ekranlar aynı seans verisine erişebilir.
    <SessionsProvider>
      {/* 
        Stack navigasyon yapısı:
        - Ekranlar arası geçişi yönetir
        - Varsayılan header (üst başlık) kapatılmıştır
      */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* 
          (tabs) route grubu:
          - app/(tabs) klasörü altındaki tab navigation'ı temsil eder
          - index.tsx ve reports.tsx ekranlarını içerir
        */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SessionsProvider>
  );
}
