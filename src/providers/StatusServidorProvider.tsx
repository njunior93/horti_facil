import { createContext, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AppContext } from "../shared/context/context";
import { StatusServidor } from '../shared/status/statusServidor';

export type StatusServidorContextType = {
  servidorOnline: boolean | null;
  conexaoInternet: boolean | null;
};

export const StatusServidorContext = createContext<StatusServidorContextType | undefined>(undefined);

export const StatusServidorProvider = ({ children }: { children: React.ReactNode }) => {
  const { servidorOnline, setServidorOnline } = useContext(AppContext);
  const { conexaoInternet, setConexaoInternet } = useContext(AppContext);

  const tempoRef = useRef<number | null>(null);
  const tentativasRef = useRef<number>(0);

  const backoff = [1000, 2000, 5000, 10000];
  const normalIntervalo = 15000;

  const proximoAgendamento = (tempo: number) => {
    if (tempoRef.current) {
      clearTimeout(tempoRef.current);
    }
    tempoRef.current = window.setTimeout(() => {
      verificarServidor();
    }, tempo);
  };

  const verificarServidor = async () => {
    setConexaoInternet(navigator.onLine);

    const backendURL = import.meta.env.VITE_API_URL;
    const supabaseURL = import.meta.env.VITE_SUPABASE_URL;

    if (!backendURL || !supabaseURL) {
      console.error("VITE_API_URL ou VITE_SUPABASE_URL não configurados");
      setServidorOnline(false);
      const tempo = backoff[Math.min(tentativasRef.current, backoff.length - 1)];
      tentativasRef.current += 1;
      proximoAgendamento(tempo);
      return;
    }

    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const [backendResult, supabaseResult] = await Promise.allSettled([
      axios.get(`${backendURL}/health`, { timeout: 5000 }),
      axios.get(`${supabaseURL}/auth/v1/health`, {
        timeout: 5000,
        headers: { apikey: supabaseAnonKey },
      }),
    ]);

    const backendOk =
      backendResult.status === "fulfilled" &&
      backendResult.value.data?.status === "ok";

    const supabaseOk = supabaseResult.status === "fulfilled";

    const tudo = backendOk && supabaseOk;
    setServidorOnline(tudo);

    if (tudo) {
      tentativasRef.current = 0;
      proximoAgendamento(normalIntervalo);
    } else {
      const tempo = backoff[Math.min(tentativasRef.current, backoff.length - 1)];
      tentativasRef.current += 1;
      proximoAgendamento(tempo);
    }
  };

  useEffect(() => {
    setTimeout(verificarServidor, 0);

    const onOn = () => verificarServidor();
    const onOff = () => verificarServidor();

    window.addEventListener("online", onOn);
    window.addEventListener("offline", onOff);

    return () => {
      if (tempoRef.current) clearTimeout(tempoRef.current);
      window.removeEventListener("online", onOn);
      window.removeEventListener("offline", onOff);
    };
  }, []);

  return (
    <StatusServidorContext.Provider value={{ conexaoInternet, servidorOnline }}>
      {children}
      <StatusServidor />
    </StatusServidorContext.Provider>
  );
};

export const useInternet = () => useContext(StatusServidorContext);
