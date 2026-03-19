import { createContext, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { AppContext } from "../shared/context/context";
import {StatusServidor} from '../shared/status/statusServidor';
import { useNavigate } from "react-router-dom";

export type StatusServidorContextType = {
  servidorOnline: boolean | null;
  sessaoAtiva:  boolean | null;
  conexaoInternet:  boolean | null;
};

export const StatusServidorContext = createContext<StatusServidorContextType | undefined>(undefined);

export const StatusServidorProvider = ({ children }: { children: React.ReactNode }) => {
  const { servidorOnline, setServidorOnline } = useContext(AppContext);
  const { sessaoAtiva, setSessaoAtiva } = useContext(AppContext);
  const {conexaoInternet, setConexaoInternet} = useContext(AppContext);

  const tempoRef = useRef<number | null>(null);
  const tentativasRef = useRef<number>(0);

  const backoff = [1000, 2000, 5000, 10000];
  const normalIntervalo = 15000;

  const proximoAgendamento = (tempo: number) =>{
    if(tempoRef.current){
      clearTimeout(tempoRef.current);
    }

    tempoRef.current = window.setTimeout(() => {
      verificarServidor();
    }, tempo);
  };

  // const verificarInternet = async (): Promise<boolean> => {
  //   try {
  //     await fetch('https://1.1.1.1', { mode: 'no-cors' });
  //     return true;
  //   }catch{
  //     return false;
  //   }
  // }

  const verificarServidor = async () =>{
    setConexaoInternet(navigator.onLine);

    try{
      const servidorURL = import.meta.env.VITE_API_URL

      if (!servidorURL) {
        console.error("VITE_API_URL não foi definido");
        setServidorOnline(false);

        const tempo = backoff[Math.min(tentativasRef.current, backoff.length - 1)];
        tentativasRef.current += 1;
        proximoAgendamento(tempo);
        return;
      }

      const response = await axios.get(`${servidorURL}/health`, { timeout: 3000 });

      const ok = response.data?.status === 'ok';

      setServidorOnline(ok);

      if (ok) {
        tentativasRef.current = 0;
        proximoAgendamento(normalIntervalo);
      } else {
        const tempo = backoff[Math.min(tentativasRef.current, backoff.length - 1)];
        tentativasRef.current += 1;
        proximoAgendamento(tempo);
      }
    }catch (error){
      setServidorOnline(false);

      const tempo = backoff[Math.min(tentativasRef.current, backoff.length -1)];
      tentativasRef.current += 1;
      proximoAgendamento(tempo);
    }
  };

  useEffect(() => {

  // dispara verificação imediata
  setTimeout(verificarServidor, 0);

  const onOn = () => verificarServidor();
  const onOff = () => verificarServidor();

  window.addEventListener("online", onOn);
  window.addEventListener("offline", onOff);

  return () => {
    if (tempoRef.current) {
      clearTimeout(tempoRef.current);
    }
    window.removeEventListener("online", onOn);
    window.removeEventListener("offline", onOff);
  };

}, []);

  return (
    <StatusServidorContext.Provider value={{conexaoInternet,servidorOnline, sessaoAtiva }}>
      {children}
      <StatusServidor />
    </StatusServidorContext.Provider>
  );
};

export const useInternet = () => useContext(StatusServidorContext)