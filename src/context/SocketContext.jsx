import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

/** @typedef {import('../types.js').AppState} AppState */

const SocketContext = createContext(null);

/**
 * Socket 연결 및 전역 상태(state 이벤트)를 제공합니다.
 */
export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  /** @type {[AppState | null, function]} */
  const [state, setState] = useState(null);
  const [toast, setToast] = useState(null);

  const socket = useMemo(() => {
    // dev: Vite(5173) 프록시로 /socket.io → 3002 (CORS·StrictMode 이슈 방지)
    return io({ transports: ["websocket", "polling"], reconnectionDelayMax: 10000 });
  }, []);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onState = (/** @type {AppState} */ s) => setState(s);
    const onErr = (msg) => {
      setToast(String(msg));
      setTimeout(() => setToast(null), 3500);
    };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("state", onState);
    socket.on("error:toast", onErr);
    setConnected(socket.connected);
    if (!socket.connected) socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("state", onState);
      socket.off("error:toast", onErr);
      // StrictMode가 effect를 두 번 돌릴 때 disconnect()하면 재연결이 안 됨
    };
  }, [socket]);

  const value = useMemo(
    () => ({
      socket,
      connected,
      state,
      toast,
      setToast,
    }),
    [socket, connected, state, toast]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useAppSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useAppSocket must be used within SocketProvider");
  return ctx;
}
