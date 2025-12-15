import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useSessions } from "../../src/context/SessionsContext";

const screenWidth = Dimensions.get("window").width;

export default function ReportsScreen() {
  const { sessions } = useSessions();

  // -------------------------------
  // Yardımcı Fonksiyonlar
  // -------------------------------
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    if (m === 0) return `${s} saniye`;
    if (s === 0) return `${m} dakika`;
    return `${m} dakika ${s} saniye`;
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const dayLabelTR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  // -------------------------------
  // Genel İstatistikler
  // -------------------------------
  const today = new Date();

  const todayTotalSeconds = sessions
    .filter((s) => isSameDay(new Date(s.createdAt), today))
    .reduce((sum, s) => sum + s.duration, 0);

  const allTimeTotalSeconds = sessions.reduce(
    (sum, s) => sum + s.duration,
    0
  );

  const totalDistractions = sessions.reduce(
    (sum, s) => sum + s.distractions,
    0
  );

  // -------------------------------
  // Son 7 Gün — Bar Chart
  // -------------------------------
  const last7Days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d);
  }

  const last7Totals = last7Days.map((day) =>
    sessions
      .filter((s) => isSameDay(new Date(s.createdAt), day))
      .reduce((sum, s) => sum + s.duration, 0)
  );

  const barChartData = {
    labels: last7Days.map((d) => dayLabelTR[d.getDay()]),
    datasets: [
      {
        data: last7Totals.map((sec) => Math.round(sec / 60)), // dakika
      },
    ],
  };

  // -------------------------------
  // Pie Chart — Kategorilere göre yüzdeli veri
  // -------------------------------
  const categoryTotals: Record<string, number> = {};

  sessions.forEach((s) => {
    if (!categoryTotals[s.category]) {
      categoryTotals[s.category] = 0;
    }
    categoryTotals[s.category] += s.duration;
  });

  const pieColors = ["#673AB7", "#4CAF50", "#FF9800", "#2196F3", "#E91E63"];

  const totalSeconds = Object.values(categoryTotals).reduce(
    (sum, sec) => sum + sec,
    0
  );

  const pieData = Object.entries(categoryTotals).map(
    ([category, seconds], i) => {
      const percentage =
        totalSeconds > 0
          ? Math.round((seconds / totalSeconds) * 100)
          : 0;

      return {
        name: category, // kendi legend'ımız için
        percentage,
        population: seconds, // grafik oranları için
        color: pieColors[i % pieColors.length],
        legendFontColor: "#333",
        legendFontSize: 14,
      };
    }
  );

  // -------------------------------
  // Chart Config
  // -------------------------------
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(103, 58, 183, ${opacity})`,
    labelColor: () => "#000",
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Raporlar</Text>

      {/* GENEL İSTATİSTİKLER */}
      <View style={styles.statsCard}>
        <Text style={styles.statsHeader}>Genel İstatistikler</Text>

        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Bugün Toplam Odaklanma:</Text>
          <Text style={styles.statsValue}>
            {formatDuration(todayTotalSeconds)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Tüm Zamanlar Toplam:</Text>
          <Text style={styles.statsValue}>
            {formatDuration(allTimeTotalSeconds)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Toplam Dikkat Dağınıklığı:</Text>
          <Text style={styles.statsValue}>{totalDistractions}</Text>
        </View>
      </View>

      {/* BAR CHART */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Son 7 Gün Odaklanma (dk)</Text>

        {/* @ts-ignore */}
        <BarChart
          data={barChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={styles.chart}
        />
      </View>

      {/* PIE CHART — sadece veri varsa çiz */}
      {pieData.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Kategorilere Göre Dağılım</Text>

          {/* @ts-ignore */}
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig} 
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            absolute
            hasLegend={false}
          />

          {/* ÖZEL YÜZDELİ LEGEND */}
          <View style={{ marginTop: 12, alignSelf: "flex-start" }}>
            {pieData.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: item.color,
                    borderRadius: 3,
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 15 }}>
                  % {item.percentage} {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* SEANS LİSTESİ */}
      <View style={styles.sessionsCard}>
        <Text style={styles.sessionsHeader}>Tüm Seanslar</Text>

        {sessions.length === 0 && <Text>Henüz seans yok</Text>}

        {sessions.sort(
            (a, b) =>
               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
        .map((s) => (
          <View key={s.id} style={styles.sessionBox}>
            <Text style={styles.sessionText}>Kategori: {s.category}</Text>
            <Text style={styles.sessionText}>
              Süre: {formatDuration(s.duration)}
            </Text>
            <Text style={styles.sessionText}>
              Dikkat Dağınıklığı: {s.distractions}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, backgroundColor: "#fff", paddingBottom: 50 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: "#f4f0ff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  statsHeader: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  statsRow: { marginBottom: 8 },
  statsLabel: { fontSize: 16, color: "#555" },
  statsValue: { fontSize: 16, fontWeight: "bold" },
  chartCard: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  chart: { borderRadius: 12 },
  sessionsCard: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 16,
    marginBottom: 40,
  },
  sessionsHeader: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  sessionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sessionText: { fontSize: 16, marginBottom: 4 },
});
