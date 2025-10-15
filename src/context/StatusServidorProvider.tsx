import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { AppContext } from "./context";
import {StatusServidor} from '../utils/statusServidor'
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

        const response = await axios.get('http://localhost:3000/status-servidor', { timeout: 5000 });

        if (response.data.status !== 'ok') {
          setServidorOnline(false);
          return;
        }

        setServidorOnline(true)       

      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          const codigoErro = err.code;
          const mensagemErro = err.message;

          if (codigoErro === 'ERR_NETWORK' || mensagemErro.includes('Network Error')) {        
            console.error("FALHA NA INTERNET", codigoErro || mensagemErro);
            setConexaoInternet(false)
          }
        } else {
          console.error("Falha ao verificar servidor:", err);
          setServidorOnline(false);
        }
      }
    };

      verificarInternet();
      verificarServidor();
      verificarSessao();
    

    const intervalo = setInterval(() => {
      verificarInternet();
      verificarServidor();
      verificarSessao();        
    }, 10000);

    return () => clearInterval(intervalo);

  }, []);

  return (
    <StatusServidorContext.Provider value={{conexaoInternet,servidorOnline, sessaoAtiva }}>
      {children}
      {/* <StatusServidor /> */}
    </StatusServidorContext.Provider>
  );
};

export const useInternet = () => useContext(StatusServidorContext)