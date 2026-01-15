import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../../../supabaseClient";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import alertaMensagem from "../../../shared/components/alertaMensagem";


export type EstoqueContextType = {
  existeEstoque: boolean | null;
  loading: boolean;
  verificarEstoque: () => Promise<void>
}

export const EstoqueContext = createContext<EstoqueContextType | undefined>(undefined);

export const EstoqueProvider = ({ children }: { children: React.ReactNode }) => {
  const [existeEstoque, setExisteEstoque] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setAlerta] = useState<React.ReactNode | null>(null);
  
    const verificarEstoque = useCallback(async () =>{

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token){
      setAlerta(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
      setExisteEstoque(null);
      throw new Error("Token ausente");

    }

    try {
      setLoading(true);

      const response = await axios.get('http://localhost:3000/estoque/verificar-estoque', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExisteEstoque(response.data.existe);
      return response.data.existe;

    } catch (error) {
      console.error("Erro ao verificar estoque:", error);
      if (axios.isAxiosError(error) && error.response){
        setAlerta(alertaMensagem(`Erro: ${error.response.data.message}`, 'warning', <ReportProblemIcon/>));          
      } else {
        setAlerta(alertaMensagem(`Não foi possível verificar o estoque. ${error}`, 'warning', <ReportProblemIcon/>));
      }
      setExisteEstoque(null);
      throw error;
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() =>{
    verificarEstoque();
  },[verificarEstoque])


  return (
      <EstoqueContext.Provider value={{ existeEstoque, loading, verificarEstoque }}>
        {children}
      </EstoqueContext.Provider>
    );
}

export const useEstoque = () => useContext(EstoqueContext)