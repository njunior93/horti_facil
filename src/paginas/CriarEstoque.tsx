import { useEffect, useState } from 'react'
import BotoesFinalizarCancelarEstoque from '../componentes/BotoesFinalizarCancelarEstoque.tsx'
import Formulario from '../componentes/Formulario.tsx'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque.tsx'
import ListaProdutos from '../componentes/ListaProdutos.tsx'
import { supabase } from '../supabaseClient.ts'
import alertaMensagem from '../utils/alertaMensagem.tsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

function CriarEstoque() {

  const navigate = useNavigate();
  const [existeEstoque, setExisteEstoque] = useState(false);

  useEffect(() => {
    
  const verificarEstoque = async () =>{

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

    try {
    const response = await axios.get('http://localhost:3000/estoque/verificar-estoque', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.existe;
    setExisteEstoque(true)

    } catch (error) {
      if (axios.isAxiosError(error) && error.response){
        setAlerta(alertaMensagem(`Erro: ${error.response.data.message}`, 'warning', <ReportProblemIcon/>));          
      } else {
        setAlerta(alertaMensagem(`Não foi possível verificar o estoque. ${error}`, 'warning', <ReportProblemIcon/>));
      }
    }
  }
  verificarEstoque()

  },[])

  

  return (
    <>
      {!existeEstoque ? (
        <div className="flex justify-center items-center h-screen w-screen ">
          <div className='flex justify-center items-center flex-col sm:flex-row'>
            <div className="flex flex-col w-full sm:size-min p-4 rounded-lg shadow-md bg-[#FCEED5]  gap-2 sm:gap-1 justify-center ">
              <Formulario />
              <ListaProdutos />
              <BotoesFinalizarCancelarEstoque/>      
            </div>
          
            <div className='flex justify-center items-center'>
                <InformaçõesEstoque telaAtual={'criar-estoque'}  />
            </div>
          </div>
        </div>
      ) : (
        <>
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#FDEFD6] text-center px-4">
          <p className="text-2xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug mb-6">
            Ja existe um estoque criado
          </p>
          <p className="text-sm md:text-lg text-gray-700 mb-8 max-w-xl">
            Volte e gerencie o seu estoque.
          </p>
        </div>
        </>
      )}
    </>
  )
}

    

export default CriarEstoque

function setAlerta(arg0: any) {
  throw new Error('Function not implemented.')
}
