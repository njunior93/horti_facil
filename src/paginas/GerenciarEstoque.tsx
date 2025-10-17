import  VisualizarEstoque  from '../componentes/VisualizarEstoque'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/context';
import alertaMensagem from '../utils/alertaMensagem';
import { supabase } from '../supabaseClient';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useEstoque } from '../context/EstoqueProvider.tsx'
import { useInternet } from '../context/StatusServidorProvider.tsx';



const GerenciarEstoque = () => {

  const {setEstoqueId} = useContext(AppContext);
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const {estoqueSalvo,setEstoqueSalvo} = useContext(AppContext);
  const navigate = useNavigate();
  const [loadingProdutos, setLoadingProdutos] = useState(false)

  const estoqueContext = useEstoque();
  const servidorContext = useInternet();
  const verificarEstoque = estoqueContext?.verificarEstoque;
  const existeEstoque = estoqueContext?.existeEstoque;
  const loading = estoqueContext?.loading;

  useEffect(() => {
  const fetchEstoqueId = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!session){
      setAlerta(alertaMensagem('Faça login para gerenciar seu estoque.', 'warning', <ReportProblemIcon/>));
      navigate("/")
      return false;
    }

    if (!token){
      setAlerta(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
      navigate("/")
      return false;
    }

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

  const fetchListaProdutos = async () => {
  
        const {data : {session}} = await supabase.auth.getSession();
        const token = session?.access_token;
  
        if (!token){
          setAlerta(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
          navigate("/pagina-login")
          return;
        }
  
        try{
          const response = await axios.get('http://localhost:3000/estoque/lista-produtos', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          setEstoqueSalvo(response.data);

        } catch (error){
          setAlerta(alertaMensagem(`Erro ao buscar lista de produtos. ${error}`, 'warning', <ReportProblemIcon/>));
        } 
  };

  fetchEstoqueId();
  fetchListaProdutos();
}, []);


  useEffect(() => {
    if(!estoqueSalvo?.listaProdutos || estoqueSalvo.listaProdutos.length === 0){
      setLoadingProdutos(true);
    } else {
      setLoadingProdutos(false);
    }
  }, [estoqueSalvo]);

  useEffect(()=>{
    const checarEstoque = async () => {
    if (verificarEstoque) {
      await verificarEstoque();
    }
  };

    checarEstoque();
  },[verificarEstoque])

  const sair = () => {
    setLoadingProdutos(false)
    navigate("/pagina-inicial");   
  }

  if (loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6]">
        <p className="text-xs md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug">
          Carregando...
        </p>
      </div>
    );
  }

  // if (loadingProdutos){
  //   return (
  //     <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6]">
  //       <p className="text-xs md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug">
  //         Carregando produtos...
  //       </p>
  //     </div>
  //   );
  // }

  if (!existeEstoque){
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#FDEFD6] text-center px-4">
        <p className="text-2xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug mb-6">
          Não foi localizado um estoque!
        </p>

        <p className="text-sm md:text-lg text-gray-700 mb-8 max-w-xl">
          Volte e crie um estoque ou verifique sua conexão.
        </p>
            
        <div className='flex flex-row gap-2'>
        <button onClick={() => sair()}className="px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-white font-bold shadow-lg hover:scale-105 transition-transform">Voltar</button>
        <button onClick={() => window.location.reload()}className="px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-white font-bold shadow-lg hover:scale-105 transition-transform">Atualizar</button>
        </div>
        
      </div>
    )
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