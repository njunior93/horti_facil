import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { AppContext } from "./context";
import {StatusServidor} from '../utils/statusServidor'

export type StatusServidorContextType = {
  servidorOnline: boolean;
  sessaoAtiva: boolean;
};

export const StatusServidorContext = createContext<StatusServidorContextType | undefined>(undefined);

export const StatusServidorProvider = ({ children }: { children: React.ReactNode }) => {
  const { servidorOnline, setServidorOnline } = useContext(AppContext);
  const { sessaoAtiva, setSessaoAtiva } = useContext(AppContext);
  // const [ultimaVerificacao, setUltimaVerificacao] = useState<Date | null>(null);

  useEffect(() => {

    const verificarSessao = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setSessaoAtiva(false);
        return; 
      }

      setSessaoAtiva(true);
      } catch (err) {
        setSessaoAtiva(false);
      }
    };

    const verificarServidor = async () => {
      try {
        const response = await axios.get('http://localhost:3000/status-servidor');
        const { data, error } = await supabase.auth.getUser();

        if (response.data.status !== 'ok' || error || !data.user) {
          setServidorOnline(false);
        } else {
          setServidorOnline(true);
        }

      } catch (err) {
        setServidorOnline(false);
      }//finally {
         //setUltimaVerificacao(new Date());
        //}
    };

    verificarServidor();
    verificarSessao();

    const intervalo = setInterval(() => {
      verificarServidor();
      verificarSessao();
    }, 10000);

    return () => clearInterval(intervalo);

  }, []);

  return (
    <StatusServidorContext.Provider value={{ servidorOnline, sessaoAtiva }}>
      {children}
      <StatusServidor />
    </StatusServidorContext.Provider>
  );
};