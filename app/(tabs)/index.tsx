import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;

    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  // KATEGORİ SEÇİLMEDİYSE KATEGORİ EKRANI GÖRÜNECEK
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

  // KATEGORİ SEÇİLDİKTEN SONRA ZAMANLAYICI EKRANI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odaklanma Zamanlayıcısı</Text>
      <Text style={styles.categoryText}>Kategori: {selectedCategory}</Text>

      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Başlat ▶️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlePause}>
          <Text style={styles.buttonText}>Duraklat ⏸</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Sıfırla 🔄</Text>
        </TouchableOpacity>

        {/* Kategori Değiştirme */}
        <TouchableOpacity
          style={styles.changeCategoryButton}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={styles.buttonText}>Kategori Değiştir 🔁</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
