import  VisualizarEstoque  from '../componentes/VisualizarEstoque'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque'
import { useContext, useEffect } from 'react';
import { AppContext } from '../context/context';
import { supabase } from '../supabaseClient';
import axios from 'axios';

const GerenciarEstoque = () => {

  const setEstoqueId = useContext(AppContext).setEstoqueId;

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
      console.error('Erro ao buscar o ID do estoque:', error);
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