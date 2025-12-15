// AsyncStorage: Telefonda kalıcı veri saklamak için kullanılır
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {
  createContext, // Global context oluşturmak için
  ReactNode, // children tipi için
  useContext, // Context’e erişmek için
  useEffect, // yükleme / kaydetme
  useState, // State tutmak için
} from "react";

// AsyncStorage içinde verilerin tutulacağı anahtar
const STORAGE_KEY = "@sessions";

// --------------------------------------------------
// Tek bir seansın veri yapısı
// --------------------------------------------------
export type Session = {
  id: number;          // Seans ID'si
  duration: number;    // Odaklanma süresi
  category: string;    // Kategori
  distractions: number; // Dikkat dağınıklığı sayısı
  createdAt: string;   // Seansın oluşturulma zamanı (ISO string)
};

// --------------------------------------------------
// Yeni seans eklerken dışarıdan alınacak veri tipi
// --------------------------------------------------
export type NewSessionInput = {
  id: number;
  duration: number;
  category: string;
  distractions: number;
};

// --------------------------------------------------
// Context’in dışarıya açacağı yapı
// --------------------------------------------------
type SessionsContextType = {
  sessions: Session[]; // Tüm seansların listesi
  addSession: (session: NewSessionInput) => void; // Yeni seans ekleme fonksiyonu
};

// --------------------------------------------------
// Context oluşturuluyor
// (default değerler sadece başlangıç için)
// --------------------------------------------------
const SessionsContext = createContext<SessionsContextType>({
  sessions: [],
  addSession: () => {}, // Provider dışı kullanımda hata olmaması için boş fonksiyon
});

// --------------------------------------------------
// Provider bileşeninin props tipi
// --------------------------------------------------
type SessionsProviderProps = {
  children: ReactNode; // Provider’ın sarmaladığı bileşenler
};

// --------------------------------------------------
// SessionsProvider: Global seans state’ini yöneten bileşen
// --------------------------------------------------
export const SessionsProvider = ({ children }: SessionsProviderProps) => {
  // Tüm seansların tutulduğu global state
  const [sessions, setSessions] = useState<Session[]>([]);

  // --------------------------------------------------
  // Uygulama ilk açıldığında
  // AsyncStorage’dan kayıtlı seansları yükle
  // --------------------------------------------------
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);

        if (jsonValue) {
          const parsed: Session[] = JSON.parse(jsonValue);
          setSessions(parsed);
        }
      } catch (error) {
        console.log("Sessions yüklenirken hata:", error);
      }
    };

    loadSessions();
  }, []);

  // --------------------------------------------------
  // sessions state değiştikçe
  // güncel verileri AsyncStorage’a kaydet
  // --------------------------------------------------
  useEffect(() => {
    const saveSessions = async () => {
      try {
        const jsonValue = JSON.stringify(sessions);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      } catch (error) {
        console.log("Sessions kaydedilirken hata:", error);
      }
    };

    saveSessions();
  }, [sessions]);

  // --------------------------------------------------
  // Yeni seans ekleme fonksiyonu
  // HomeScreen tarafından çağrılır
  // --------------------------------------------------
  const addSession = (sessionInput: NewSessionInput) => {
    // Dışarıdan gelen veriye createdAt eklenir
    const newSession: Session = {
      ...sessionInput,
      createdAt: new Date().toISOString(),
    };

    // Önceki seansları bozmadan yeni seansı ekle
    setSessions((prev) => [...prev, newSession]);
  };

  // --------------------------------------------------
  // Context Provider
  // Altındaki tüm bileşenler sessions ve addSession’a erişebilir
  // --------------------------------------------------
  return (
    <SessionsContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = () => useContext(SessionsContext);
