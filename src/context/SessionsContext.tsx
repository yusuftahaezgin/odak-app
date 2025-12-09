import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@sessions";

// Tek bir seansın tipi
export type Session = {
  id: number;
  duration: number; // saniye
  category: string;
  distractions: number;
  createdAt: string; // ISO tarih string (grafikler için işimize yarayacak)
};

// Yeni seans eklerken dışarıya açacağımız input tipi
export type NewSessionInput = {
  id: number;
  duration: number;
  category: string;
  distractions: number;
};

type SessionsContextType = {
  sessions: Session[];
  addSession: (session: NewSessionInput) => void;
};

const SessionsContext = createContext<SessionsContextType>({
  sessions: [],
  addSession: () => {},
});

type SessionsProviderProps = {
  children: ReactNode;
};

export const SessionsProvider = ({ children }: SessionsProviderProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  // Uygulama açıldığında AsyncStorage'dan verileri yükle
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

  // sessions değiştikçe AsyncStorage'a kaydet
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

  const addSession = (sessionInput: NewSessionInput) => {
    const newSession: Session = {
      ...sessionInput,
      createdAt: new Date().toISOString(),
    };

    setSessions((prev) => [...prev, newSession]);
  };

  return (
    <SessionsContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = () => useContext(SessionsContext);
