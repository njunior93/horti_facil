import  VisualizarEstoque  from '../componentes/VisualizarEstoque'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/context';
import alertaMensagem from '../utils/alertaMensagem';
import { supabase } from '../supabaseClient';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import axios from 'axios';


const GerenciarEstoque = () => {

  const setEstoqueId = useContext(AppContext).setEstoqueId;
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);

  useEffect(() => {
  const fetchEstoqueId = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const response = await axios.get('http://localhost:3000/estoque/id-estoque', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEstoqueId(response.data.estoqueId);
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response){
        setAlerta(alertaMensagem(`Erro: ${error.response.data.message}`, 'warning', <ReportProblemIcon/>));
      } else {
        setAlerta(alertaMensagem(`Erro ao buscar ID do estoque`, 'warning', <ReportProblemIcon/>));
        console.error('Erro ao buscar o ID do estoque:', error);
      }
    }
  };

  fetchEstoqueId();
}, []);
  
  return (
    <div className='flex justify-center item-center h-screen w-screen'>
      <div className='flex justify-center item-center flex-col-reverse sm:flex-row'>
        <div className='flex justify-center items-center'>
          <VisualizarEstoque/>
        </div>

        <div className='flex justify-center items-center'>
          <InformaçõesEstoque telaAtual={'gerenciar-estoque'}/>
        </div>
      </div>    
    </div>
    
  )
}

export default GerenciarEstoque