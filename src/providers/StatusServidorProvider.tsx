import { createContext, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { AppContext } from "../shared/context/context";
import {StatusServidor} from '../shared/status/statusServidor';
import { useNavigate } from "react-router-dom";

export type StatusServidorContextType = {
  servidorOnline: boolean;
  sessaoAtiva: boolean;
  conexaoInternet: boolean;
};

export const StatusServidorContext = createContext<StatusServidorContextType | undefined>(undefined);

export const StatusServidorProvider = ({ children }: { children: React.ReactNode }) => {
  const { servidorOnline, setServidorOnline } = useContext(AppContext);
  const { sessaoAtiva, setSessaoAtiva } = useContext(AppContext);
  const {conexaoInternet, setConexaoInternet} = useContext(AppContext);

  const navigate = useNavigate();

  const tempoRef = useRef<number | null>(null);
  const tentativasRef = useRef<number>(0);

  const backoff = [2000,5000,10000,30000,60000];
  const normalIntervalo = 15000;

  const proximoAgendamento = (tempo: number) =>{
    if(tempoRef.current){
      clearTimeout(tempoRef.current);
    }

    tempoRef.current = window.setTimeout(() => {
      verificarServidor();
    }, tempo);
  };

  const verificarInternet = async (): Promise<boolean> => {
    try {
      await fetch('https://www.google.com', { mode: 'no-cors' });
      return true;
    }catch{
      return false;
    }
  }

  const verificarServidor = async () =>{
    const online = navigator.onLine || await verificarInternet();
    setConexaoInternet(online);

    if(!online){
      setServidorOnline(false);

      const tempo = backoff[Math.min(tentativasRef.current, backoff.length -1)];
      tentativasRef.current += 1;
      proximoAgendamento(tempo);
      return;
    }

    try{
      const servidorURL = import.meta.env.VITE_API_URL

      const response = await axios.get(`${servidorURL}/status-servidor`, { timeout: 5000 });

      const ok = response.data?.status === 'ok';
      setServidorOnline(ok);

      tentativasRef.current = 0;
      proximoAgendamento(normalIntervalo);
    }catch (error){
      setServidorOnline(false);

      const tempo = backoff[Math.min(tentativasRef.current, backoff.length -1)];
      tentativasRef.current += 1;
      proximoAgendamento(tempo);
    }
  };

  const forcarLogin = () =>{
    if (location.pathname !== "/") {
      navigate("/");
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data,error }) => {
      const ativa = !!data.session && !error;
      setSessaoAtiva(ativa);

      if(!ativa){
        forcarLogin();
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const ativa = !!session;
      setSessaoAtiva(ativa);

      if (!ativa) {
        forcarLogin();
      }
    });

    verificarServidor();

    const onOn = () => verificarServidor();
    const onOff = () => verificarServidor();

    window.addEventListener("online", onOn);
    window.addEventListener("offline", onOff);

    return () => {
      sub.subscription.unsubscribe();
      if (tempoRef.current) {
        clearTimeout(tempoRef.current);
      }
      window.removeEventListener("online", onOn);
      window.removeEventListener("offline", onOff);
    }
  },[]);

  const carregando = conexaoInternet === null || servidorOnline === null || sessaoAtiva === null;

  if(carregando) {
    return<div>Carregando status do sistema...</div>
  }

  return (
    <StatusServidorContext.Provider value={{conexaoInternet,servidorOnline, sessaoAtiva }}>
      {children}
      <StatusServidor />
    </StatusServidorContext.Provider>
  );
};

export const useInternet = () => useContext(StatusServidorContext)