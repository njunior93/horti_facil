import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { AppContext } from "./context";
import {StatusServidor} from '../shared/status/statusServidor'
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

  useEffect(() => {

    const verificarInternet = async (): Promise<boolean> => {
      try {
        await fetch("https://1.1.1.1", { mode: "no-cors" });
        return true;
      } catch {
        return false;
      }
}

    const verificarSessao = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setSessaoAtiva(false);
        if (location.pathname !== "/") {
          navigate("/");
        }
        return; 
        }

      if (!session) {
        setSessaoAtiva(false);
        if (location.pathname !== "/") {
          navigate("/");
        }
        return; 
      }

      setSessaoAtiva(true);
      } catch (err) {
        setSessaoAtiva(false);
        navigate('/')
      }
    };

    const verificarServidor = async () => {

      try{
        const internetOk = await verificarInternet();
        setConexaoInternet(internetOk)
        
        if (!internetOk) {
          setServidorOnline(false);
        return;
    }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/status-servidor`, { timeout: 5000 });

        if (response.data.status === 'ok') {
          if (!servidorOnline) setServidorOnline(true);
        } else{
          if (servidorOnline) setServidorOnline(false);
        }

      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          const codigoErro = err.code;
          const mensagemErro = err.message;

          if(!conexaoInternet){
            return;
          }

          if (codigoErro === 'ECONNABORTED') {
            console.error("Servidor demorou para responder", mensagemErro);
            if (servidorOnline) setServidorOnline(false);
            return;
          }

          if (codigoErro === 'ERR_NETWORK' && conexaoInternet) {
            console.error("Servidor fora do ar", mensagemErro);        
            if (servidorOnline) setServidorOnline(false);
            return;
          }

          if (codigoErro === 'ERR_NETWORK' && !conexaoInternet) {
            console.error("Sem conexão com a internet", mensagemErro);        
            if (conexaoInternet) setConexaoInternet(false);
            return;
          }
        }
          
          console.error("Falha ao verificar servidor:", err);
          if (servidorOnline) setServidorOnline(false);    
      }
    };

      verificarInternet();
      verificarServidor();
      verificarSessao();
    

    const intervalo = setInterval(() => {
      verificarInternet();
      verificarServidor();
      verificarSessao();        
    }, 2000);

    return () => clearInterval(intervalo);

  }, [conexaoInternet, servidorOnline]);

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