import  VisualizarEstoque  from '../componentes/VisualizarEstoque'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/context';
import alertaMensagem from '../utils/alertaMensagem';
import { supabase } from '../supabaseClient';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import axios from 'axios';


const GerenciarEstoque = () => {

  const {setEstoqueId} = useContext(AppContext);
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const estoqueSalvo = useContext(AppContext).estoqueSalvo;

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
        setAlerta(alertaMensagem(`Erro ao buscar ID do estoque ${error}`, 'warning', <ReportProblemIcon/>));
      }
    }
  };

  fetchEstoqueId();
}, []);

  useEffect(() => {
    if(!estoqueSalvo?.listaProdutos || estoqueSalvo.listaProdutos.length === 0){
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [estoqueSalvo]);
  

  if (loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6]">
        <p className="text-xs md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug">
          Carregando...
        </p>
      </div>
    );
  }
  
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