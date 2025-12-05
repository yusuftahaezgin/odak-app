import { StyleSheet, Text, View } from "react-native";
import { useSessions } from "../context/SessionsContext";

export default function ReportsScreen() {
  const { sessions } = useSessions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raporlar</Text>

      {sessions.length === 0 && <Text>Henüz seans yok</Text>}

      {sessions.map((s) => (
        <View key={s.id} style={styles.card}>
          <Text style={styles.text}>Kategori: {s.category}</Text>
          <Text style={styles.text}>Süre: {s.duration / 60} dk</Text>
          <Text style={styles.text}>Dikkat Dağınıklığı: {s.distractions}</Text>
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
    borderRadius: 10,
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
  },
});
