import { useEffect } from 'react'
import BotoesFinalizarCancelarEstoque from '../componentes/BotoesFinalizarCancelarEstoque.tsx'
import Formulario from '../componentes/Formulario.tsx'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque.tsx'
import ListaProdutos from '../componentes/ListaProdutos.tsx'
import { useEstoque } from '../context/EstoqueProvider.tsx'
import { useNavigate } from "react-router-dom";


function CriarEstoque() {

  const navigate = useNavigate();
  const estoqueContext = useEstoque();
  const verificarEstoque = estoqueContext?.verificarEstoque;
  const existeEstoque = estoqueContext?.existeEstoque;
  const loading = estoqueContext?.loading;

  useEffect(()=>{
    const checarEstoque = async () => {
    if (verificarEstoque) {
      await verificarEstoque();
    }
  };

    checarEstoque();
  },[verificarEstoque])

   const sair = () => {
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

  if (existeEstoque){
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#FDEFD6] text-center px-4">
        <p className="text-2xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug mb-6">
          Ja possui estoque criado!
        </p>

        <p className="text-sm md:text-lg text-gray-700 mb-8 max-w-xl">
          Volte e gerencie o seu estoque.
        </p>
            
        <button onClick={() => sair()}className="px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-white font-bold shadow-lg hover:scale-105 transition-transform">Voltar</button>
      </div>
    )
  }

  return (
    <>
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
    </>
  )
}

export default CriarEstoque