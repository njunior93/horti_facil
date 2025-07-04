import { useContext } from "react";
import type { iProdutoMov } from "../type/iProdutoMov"
import { AppContext } from "../context/context";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Button } from "@mui/material";



const ListaMovManual = () => {

  const {listaProdutoMov, setListaProdutoMov} = useContext(AppContext);
  const tipoModal = useContext(AppContext).tipoModal;

    const excluirProdudoEntrada = (produto: iProdutoMov) => {
      const id_localizado = listaProdutoMov.find(p => p.produto.id === produto.produto.id);

      if(id_localizado !== undefined){
        const novaLista = listaProdutoMov.filter((p) => p.produto.id !== produto.produto.id);
        setListaProdutoMov(novaLista)   
      }
    };
  
  return (
    <div className='bg-[#EAEFEF] h-32 mt-2 overflow-auto text-sm' >
      <div className={`grid ${tipoModal === 'Entrada' ? 'grid-cols-4' : 'grid-cols-5'} items-center p-2 border-b text-center`}>
        <div className="font-medium">Produto</div>
        <div>Estoque</div>
        <div>{tipoModal === 'Entrada' ? 'Entrada' : tipoModal === 'Saida' ? 'Saida' : ''}</div>
        {tipoModal === 'Saida' && (<div>Mov</div>)}
        <div>Excluir</div>
      </div>

       {listaProdutoMov.map((item) => (
        <div key={item.produto.id} className={`grid ${tipoModal === 'Entrada' ? 'grid-cols-4' : 'grid-cols-5'} items-center p-2 border-b text-center`}>
          <div>{item.produto.nome}</div>
          <div>{item.produto.estoque}</div>
          <div>{item.qtdMov}</div>
          {tipoModal === 'Saida' && (<div>{item.tipoSaida}</div>)}
          <Button onClick={() => excluirProdudoEntrada(item)} startIcon={<RemoveCircleIcon/>}></Button>
        </div>
      ))}
    </div>
  )
}

export default ListaMovManual