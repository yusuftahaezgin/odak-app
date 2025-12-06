import { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSessions } from "../context/SessionsContext";

export default function HomeScreen() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [distractions, setDistractions] = useState(0);
  const appState = useRef(AppState.currentState);

  const { addSession } = useSessions();

  // -------------------------------
  // 1) Sayaç çalışma mantığı
  // -------------------------------
  useEffect(() => {
    let timer: any;

    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    // SIFIRA İNDİĞİNDE OTOMATİK KAYDET
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      kaydetSession();
    }

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  // -------------------------------
  // 2) AppState — Dikkat dağınıklığı takibi
  // -------------------------------
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log("📌 Uygulamadan çıkıldı → Dikkat dağınıklığı!");

        if (isRunning) {
          setIsRunning(false);
          setDistractions((prev) => prev + 1);
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning]);

  // -------------------------------
  // 3) Zaman formatı
  // -------------------------------
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // -------------------------------
  // 4) Seans kaydetme
  // -------------------------------
  const kaydetSession = () => {
    addSession({
      id: Date.now(),
      duration: 25 * 60 - secondsLeft,
      category: selectedCategory!,
      distractions: distractions,
    });

    setDistractions(0);
  };

  // -------------------------------
  // 5) Kategori ekranı
  // -------------------------------
  if (!selectedCategory) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kategori Seç</Text>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory("Ders")}
        >
          <Text style={styles.buttonText}>📚 Ders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory("Kodlama")}
        >
          <Text style={styles.buttonText}>💻 Kodlama</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory("Kitap")}
        >
          <Text style={styles.buttonText}>📖 Kitap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory("Proje")}
        >
          <Text style={styles.buttonText}>🛠 Proje</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // -------------------------------
  // 6) Zamanlayıcı ekranı
  // -------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odaklanma Zamanlayıcısı</Text>
      <Text style={styles.categoryText}>Kategori: {selectedCategory}</Text>

      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => setIsRunning(true)}>
          <Text style={styles.buttonText}>Başlat ▶️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setIsRunning(false)}>
          <Text style={styles.buttonText}>Duraklat ⏸</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setIsRunning(false);
            setSecondsLeft(25 * 60);
            kaydetSession();
          }}
        >
          <Text style={styles.buttonText}>Sıfırla 🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changeCategoryButton}
          onPress={() => {
            setSelectedCategory(null);
            setDistractions(0);
            setSecondsLeft(25 * 60);
          }}
        >
          <Text style={styles.buttonText}>Kategori Değiştir 🔁</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --------------------------------------------
// 7) Stil dosyası
// --------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 40,
  },
  buttons: {
    width: "80%",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  changeCategoryButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  categoryButton: {
    backgroundColor: "#673AB7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
