import { StyleSheet, Text, View } from "react-native";
import { useSessions } from "../context/SessionsContext";

export default function ReportsScreen() {
  const { sessions } = useSessions();

  const formatDuration = (durationInSeconds: number) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    if (minutes === 0) {
      return `${seconds} saniye`;
    }

    if (seconds === 0) {
      return `${minutes} dakika`;
    }

    return `${minutes} dakika ${seconds} saniye`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raporlar</Text>

      {sessions.length === 0 && <Text>Henüz seans yok 👀</Text>}

      {sessions.map((s) => (
        <View key={s.id} style={styles.card}>
          <Text style={styles.cardText}>Kategori: {s.category}</Text>
          <Text style={styles.cardText}>Süre: {formatDuration(s.duration)}</Text>
          <Text style={styles.cardText}>Dikkat Dağınıklığı: {s.distractions}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardText: {
    fontSize: 18,
    marginBottom: 4,
  },
});
