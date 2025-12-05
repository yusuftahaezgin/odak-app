import React, { createContext, useContext, useState } from "react";

type Session = {
  id: number;
  duration: number; // saniye
  category: string;
  distractions: number;
};

type SessionsContextType = {
  sessions: Session[];
  addSession: (session: Session) => void;
};

const SessionsContext = createContext<SessionsContextType>({
  sessions: [],
  addSession: () => {},
});

export const SessionsProvider = ({ children }: any) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session]);
  };

  return (
    <SessionsContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = () => useContext(SessionsContext);
