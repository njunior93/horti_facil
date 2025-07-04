import { useContext } from "react";
import { AppContext } from "../context/context";

type ListaProdutosVisualizarProps ={
  nome: string | null;
  tipo: string | null
  qtd: number | null
}

const ListaProdutosVisualizar = ({nome, tipo, qtd} : ListaProdutosVisualizarProps) => {
  const estoqueSalvo = useContext(AppContext).estoqueSalvo;

  const produtosFiltrados = estoqueSalvo.listaProdutos.filter((produto: any) => {

    const filtroNome = nome != null && nome.length > 0 ? produto.nome.toLowerCase().includes(nome.toLowerCase()) : true;

    const filtroTipo = tipo != null && tipo !== "todos" && tipo.length > 0 ? produto.tipo.toLowerCase().trim() === tipo.toLowerCase().trim() : true;

    const filtroEstoque = qtd != null  && qtd > 0 ? produto.estoque === qtd : true;
      
    return filtroTipo && filtroNome && filtroEstoque;
  });
  
  const produtosParaExibir = produtosFiltrados;

  return (
    <>
    <span className="text-1xl font-bold text-gray-800">Produtos estocados</span>
    <div className='grid grid-cols-5 items-center p-2 border-b text-center font-bold text-sm'>
        <div>Produto</div>
        <div>Unidade de M.</div>
        <div>Estoque Atual</div>
        <div>Estoque Mínimo</div>
        <div>Estoque Máximo</div>

      </div>

    <div className="bg-[#EAEFEF] h-32 text-sm overflow-auto">
      {produtosParaExibir.map((produto: any, index: number) => (
        <div key={produto.codigo || index} className={`grid grid-cols-5 items-center p-2 border-b text-center text-sm ${(produto.estoqueSuficiente === false) ? 'bg-[#EA2F14] text-white' : 'bg-[#00DA63]'}`}>
          <div>{produto.nome}</div>
          <div>{produto.uniMedida}</div>
          <div>{produto.estoque}</div>
          <div>{produto.estoqueMinimo}</div>
          <div>{produto.estoqueMaximo}</div>
        </div>
      ))}
    </div>
    </>
  );
}

export default ListaProdutosVisualizar