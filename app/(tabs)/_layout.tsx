import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

// TabLayout: Alt sekmeli navigasyon barı tanımlar
export default function TabLayout() {
  return (
    // headerShown: false -> otomatik üst başlık gizlenir
    <Tabs screenOptions={{ headerShown: false }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, size }) => (
            // Ana sayfa için zamanlayıcı ikonu
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Raporlar", 
          tabBarIcon: ({ color, size }) => (
            // Rapor ekranı için istatistik ikonu
            <Ionicons
              name="stats-chart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
