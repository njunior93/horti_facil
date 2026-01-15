import { useEffect } from 'react'
import BotoesFinalizarCancelarEstoque from '../components/BotoesFinalizarCancelarEstoque.jsx'
import FormularioEstoque from '../components/FormularioEstoque.jsx'
import InformacoesEstoque from '../components/InformacoesEstoque.jsx'
import ListaProdutosEstoque from '../components/ListaProdutosEstoque.jsx'
import { useEstoque } from '../provider/EstoqueProvider.tsx'
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
      <div className="flex justify-center items-center min-h-dvh w-full bg-[#F6E7C8]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          <div className="mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              Criar Estoque
            </h1>
            <p className="text-sm text-gray-600">
              Adicione produtos e defina mínimo/máximo para controle do estoque.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            <section className="lg:col-span-9">
              <div className="rounded-2xl bg-[#FCEED5] shadow-md border border-white/60 p-3 sm:p-5">
                <FormularioEstoque />
                <div className="mt-3 sm:mt-4">
                  <ListaProdutosEstoque />
                </div>
                <div className="mt-3 sm:mt-4">
                  <BotoesFinalizarCancelarEstoque />
                </div>
              </div>
            </section>

            <aside className="lg:col-span-3">
              <div className="rounded-2xl bg-white shadow-md border border-gray-100 p-3 sm:p-4 flex justify-center">
                <InformacoesEstoque telaAtual={"criar-estoque"} />
              </div>
            </aside>

          </div>
        </div>
    </div>
    </>
  );
}

export default CriarEstoque