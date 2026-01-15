import { useContext, useEffect } from "react";
import { AppContext } from "../../../shared/context/context";

type Props = {
  telaAtual: string;
}

const InformaçõesEstoque = ({telaAtual}: Props) => {
  const {contSuficiente, setContSuficiente} = useContext(AppContext);
  const {contInsuficiente, setContInsuficiente} = useContext(AppContext);
  const {contQtdEstoque, setContQtdEstoque} = useContext(AppContext);
  const listaProdutoEstoque  = useContext(AppContext).listaProdutoEstoque;
  const { estoqueSalvo } = useContext(AppContext);


  useEffect(() => {
    let Suficiente = 0;
    let Insuficiente = 0;

    const listaAtual = telaAtual === 'criar-estoque' ? listaProdutoEstoque : estoqueSalvo?.listaProdutos ?? [];

    listaAtual.forEach((produto) => {
      if ((produto.estoque ?? 0) >= (produto.estoqueMinimo ?? 0)) {
        Suficiente++;
      } else {
        Insuficiente++;
      }
    });

    setContSuficiente(Suficiente);
    setContInsuficiente(Insuficiente);
    if (telaAtual === 'criar-estoque') {
      setContQtdEstoque(listaAtual.length);
    } else if (telaAtual === 'gerenciar-estoque' && estoqueSalvo) {
      setContQtdEstoque(estoqueSalvo.contQtdEstoque);
    } 
    
  },[telaAtual, listaProdutoEstoque, estoqueSalvo]);


  return (
    <div className='w-2/3 h-full p-1 sm:p-4 bg-white flex flex-row justify-center items-center lg:flex-col text-xs sm:text-base gap-2'>
      <div className='text-gray-700 rounded-lg shadow-md font-bold mb-4 text-center bg-gray-200 p-1'>
        <p className="text-black">Quantidade de Produtos <br/><span className="text-[#0065F8]">{contQtdEstoque}</span></p>
      </div>
      <div className='text-gray-700 rounded-lg shadow-md font-bold mb-4 text-center bg-gray-200 p-1'>
        <p className="text-[#00DA63]">Produtos com estoque suficiente <br/><span className="text-[#0065F8]">{contSuficiente}</span></p>
      </div>
      <div className='text-gray-700 rounded-lg shadow-md font-bold mb-4 text-center bg-gray-200 p-1'>
        <p className="text-[#EA2F14]">Produtos para abastecer estoque <br/><span className="text-[#0065F8]">{contInsuficiente}</span></p>
      </div>
    </div>
  )
}

export default InformaçõesEstoque