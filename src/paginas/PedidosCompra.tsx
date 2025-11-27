import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext ,useGridSelector, type GridColDef, type GridRowModel} from '@mui/x-data-grid';
import { Box, CardHeader, CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useContext, useState } from 'react';
import { AppContext } from '../context/context';
import ModalMov from '../utils/modalMov';
import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import alertaMensagem from "../utils/alertaMensagem";
import axios from 'axios';
import { 
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';
import { useEstoque } from '../context/EstoqueProvider.tsx'
import { useNavigate } from "react-router-dom";
import type { iPedido } from '../type/iPedido.ts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type {LinhaItem} from '../type/iLinhaItem';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useInternet } from '../context/StatusServidorProvider.tsx';
import { gerarVisualizacaoPedidoPDF } from '../utils/gerarVisualizacaoPedidoPDF.ts';



const PedidosCompra = () => {

const [mensagemErro, setMensagemErro] = useState<React.ReactNode | null>(null);
const setTipoModal = useContext(AppContext).setTipoModal;
const { setHandleModal} = useContext(AppContext);
const {estoqueSalvo, setEstoqueSalvo} = useContext(AppContext);
const {listaFornecedores, setListaFornecedores} = useContext(AppContext);
const { listaPedidosCompra, setListaPedidosCompra } = useContext(AppContext);
const { estoqueId, setEstoqueId } = useContext(AppContext);
const [selectedRows, setSelectedRows] = useState<any[]>([]);
const [idsSelecionados, setIdsSelecionados] = useState<any[]>([]);
const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
const navigate = useNavigate();
const [cardAberto, setCardAberto] = useState(false);
const [pedidoSelecionado, setPedidoSelecionado,] = useState<iPedido>()
const [btnOperacao, setbtnOperacao] = useState<'efetivar' | 'cancelar' | 'visualizar'>()
const [linhaPedidoItens, setLinhaPedidoItens] = useState<LinhaItem[]>([]);
const [isLoadingItems, setIsLoadingItems] = useState(true);
const estoqueContext = useEstoque();
const StatusServidorContext = useInternet();
const [statusPedido, setStatusPedido] = useState<string>('pendente');
const [statusAtualPedidoSelecionado, setStatusAtualPedidoSelecionado] = useState<string>('');

const conexaoInternet = StatusServidorContext?.conexaoInternet;
const servidorOnline = StatusServidorContext?.servidorOnline;
const verificarEstoque = estoqueContext?.verificarEstoque;
const existeEstoque = estoqueContext?.existeEstoque;
const loading = estoqueContext?.loading;

    

setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);


 setTimeout(() =>{
    if(mensagemErro){
      setMensagemErro(null)
    }
  },4000);

useEffect(() => {

  const checarEstoque = async () => {
    if (verificarEstoque) {
      await verificarEstoque();
    }
  };

  const fetchListaProdutos = async () => {
    const {data : {session}} = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token){
      setMensagemErro(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
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
        setMensagemErro(alertaMensagem(`Erro ao buscar lista de produtos. ${error}`, 'warning', <ReportProblemIcon/>));
      } 
  };

  const fetchlistaFornecedores = async () => {
          
    const {data: {session}} = await supabase.auth.getSession();
    const token = session?.access_token;
    
     try{
    
      if (!token){
        setMensagemErro(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
        return;
      }
    
      const response = await axios.get(`http://localhost:3000/fornecedor/listar-fornecedores`,
        { headers: {Authorization: `Bearer ${token}`}}
      );

      setListaFornecedores(response.data);

      } catch (error) {
       if(axios.isAxiosError(error) && error.response){
        console.log(error);
         setMensagemErro(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
      } else {
        console.log(error);
        setMensagemErro(alertaMensagem(`Ocorreu um erro ao buscar a lista de fornecedores. Tente novamente. ${error}`, 'error', <ReportProblemIcon />));
      }
    }
    
  };

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
          setMensagemErro(alertaMensagem(`Erro: ${error.response.data.message}`, 'warning', <ReportProblemIcon/>));
        } else {
          setMensagemErro(alertaMensagem(`Erro ao buscar ID do estoque ${error}`, 'warning', <ReportProblemIcon/>));
        }
      }
  };

  const fetchListaPedidosCompra = async () => {
    
    try{

      const {data: {session}} = await supabase.auth.getSession();
      const token = session?.access_token;
    
      if (!token){
        setMensagemErro(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
        return;
      }

      const response = await axios.get(`http://localhost:3000/pedido/listar-pedidos`,
        { headers: {Authorization: `Bearer ${token}`}}
      );

      setListaPedidosCompra(response.data);

    } catch (error) {
      if(axios.isAxiosError(error) && error.response){
        setMensagemErro(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
      } else {
        setMensagemErro(alertaMensagem(`Ocorreu um erro ao buscar os pedidos de compra. Tente novamente. ${error}`, 'error', <ReportProblemIcon />));
      }
  }

  };

    checarEstoque();
    fetchEstoqueId();
    fetchlistaFornecedores();
    fetchListaProdutos();
    fetchListaPedidosCompra();
    
    
}, []); 

const sair = () => {
  navigate("/pagina-inicial");
  setTipoModal('')
  setHandleModal(false);
}


const colunas: GridColDef<(typeof linhas)[number]>[] = [
  { 
    field: 'id',
    headerName: 'ID', 
    width: 150 
  },
  {
    field: 'fornecedor',
    headerName: 'Fornecedor',
    width: 300,
    editable: false,
  },
  {
    field: 'dataPedido',
    headerName: 'Data de criação',
    width: 150,
    editable: false,
  },
  { 
    field: 'status', 
    headerName: 'Status do Pedido', 
    width: 250 ,
    renderCell: (params) => {

      const status = params.value || "";
      const letra = status.charAt(0).toUpperCase();

      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "pendente":
            return "#fbc02d";
          case "entregue":
            return "#4caf50"; 
          case "entregue_parcialmente":
            return "#f0870eff";
          case "cancelado":
            return "#f44336"; 
          default:
            return "#9e9e9e"; 
        }
      };

      const cor = getStatusColor(status);

      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: cor,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 14,
          }}
          >
            {letra}
          </div>
        <span style={{ textTransform: 'capitalize' }}>{status}</span>
        </div>
      );
    },
  },  
 
];

const linhas = listaPedidosCompra.map((pedido) => {
  
  const data = pedido.data_criacao ? new Date(pedido.data_criacao) : null;
  const dataFormatada = data ? data.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';

  return {
    id: pedido.id,
    status: pedido.status,
    dataPedido: dataFormatada,
    fornecedor: pedido.fornecedor?.nome ?? '-'
  };

});

const valorRecebido = (novoValor: GridRowModel, antigoValor:GridRowModel) =>{
  
  if (isNaN(novoValor.recebido) || novoValor.recebido < 0 || novoValor.recebido === null || novoValor.recebido === undefined || novoValor.recebido === '' || !Number.isInteger(Number(novoValor.recebido))) {
    setAlerta(alertaMensagem('Digite apenas números inteiros e positivos.', 'warning', <ReportProblemIcon/>));

    return antigoValor;
  }

  const recebido = Number(novoValor.recebido);
  const solicitado = Number(novoValor.reposicao);

  if (recebido >= solicitado && solicitado > 0) {
    setStatusPedido('entregue');
  } else if (recebido > 0 && recebido < solicitado) {
    setStatusPedido('entregue_parcialmente');
  } else {
    setStatusPedido('entregue_parcialmente');
  }

  setLinhaPedidoItens((prevItens) =>
  prevItens.map((item) =>
    item.id === novoValor.id ? { ...item, recebido: recebido } : item
    )
  );


  return novoValor;
}

const colunasPedidoItens: GridColDef[] = [
  // { 
  //   field: 'id',
  //   headerName: 'ID', 
  //   width: 90 
  // },
  { 
    field: 'produto',
    headerName: 'Produto', 
    width: 100,
  },
  { 
    field: 'unidade',
    headerName: 'Unidade', 
    width: 120,
  },
  { 
    field: 'minimo',
    headerName: 'Estoque Minimo', 
    width: 130,
  },
  { 
    field: 'reposicao',
    headerName: 'Solicitado', 
    width: 120,
  },
  { 
    field: 'recebido',
    headerName: 'Recebido', 
    width: 125,
    editable: true,
    cellClassName: 'celula-recebido-editavel',
    renderHeader: () => (    
      <Tooltip title={<span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Recebido (Editável): Digite ou ajuste o valor recebido. Atenção: Se este campo for alterado, ao finalizar, o pedido passará para o status de 'Entregue Parcialmente'</span>}>
        <span>Recebido <HelpOutlineIcon sx={{ bgcolor: 'yellow', borderRadius: '100%' }}/></span>
      </Tooltip>
    )
  },
]

const handlecriarPedido = () => {
  setTipoModal('CriarPedidoCompra');
  setHandleModal(true); 
}

const abrirPedido = async (pedidoId: number) => {

  setAlerta(null);

  const {data: {session}} = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    setAlerta(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
    return;
  }
  
  if (!session){
    setAlerta(alertaMensagem('Faça login para salvar o fornecedor.', 'warning', <ReportProblemIcon/>));
    return;
  }

  if(idsSelecionados.length !== 1){
    setAlerta(alertaMensagem('Selecione apenas um pedido para realizar esta operação.', 'warning', <ReportProblemIcon/>));
    return;
  }

  setCardAberto(true);
  setIsLoadingItems(true);

  try{
    const response = await axios.get(`http://localhost:3000/pedido/localizar-pedido/${pedidoId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const novoPedido = response.data;

    setPedidoSelecionado(novoPedido)

    if(novoPedido?.itens && Array.isArray(novoPedido.itens)){
      const linhasFormatadas = novoPedido.itens.map((item: any) =>({
        id: item.produto_id,
        produto: item.produto?.nome || '',
        unidade: item.produto.uniMedida,
        minimo: item.produto.estoqueMinimo,
        reposicao: item.qtd_solicitado,
        recebido: item.qtd_solicitado
      }))
      setLinhaPedidoItens(linhasFormatadas)

    } else {
      setLinhaPedidoItens([])
    }

  } catch (error) { 
    console.error("Erro ao abrir pedido", error);
    setAlerta(alertaMensagem("Erro ao abrir pedido", "error", <ReportProblemIcon/>));

    if(axios.isAxiosError(error)){

    if(!conexaoInternet ){
      console.error("Sem acesso a internet. Verifique sua conexão", error);
      setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
    }

    if(!servidorOnline){
      console.error("Servidor fora do ar. Tente novamente em instantes", error);
      setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
      return;
    }

    if(error.response){
      const status = error.response.status;
      const mensagem = error.response.data?.message || error.message;

     if(status >= 500){
        console.error(`Erro ao abrir pedido ${status} ${mensagem}`)
        setAlerta(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
      } else if (status === 404){
        console.error(`Erro ao abrir pedido ${status} ${mensagem}`)
        setAlerta(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
      } else {
        console.error(`Erro ao abrir pedido ${status} ${mensagem}`)
        setAlerta(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
      }

       return;
    }

    if(error.code === 'ECONNABORTED'){
      console.error(`Erro ao abrir pedido ${error}`)
      setAlerta(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
       return;
    }

    setAlerta(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
    return; 
  }

  } finally {
    setIsLoadingItems(false);
}

}

const efetivarPedido = async (pedidoId: number) => {
  const {data: {session}} = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    setAlerta(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
    return;
  }
  
  if (!session){
    setAlerta(alertaMensagem('Faça login para efetivar o pedido.', 'warning', <ReportProblemIcon/>));
    return;
  }

  let novoStatus = statusPedido;

  if(!novoStatus || novoStatus === 'pendente'){
    const todosEntregues = linhaPedidoItens.every((item) => item.recebido >= item.reposicao);
    const algumEntregue = linhaPedidoItens.some((item) => item.recebido > 0 && item.recebido < item.reposicao);

    if(todosEntregues){
      novoStatus = 'entregue';
    } else if (algumEntregue){
      novoStatus = 'entregue_parcialmente';
    } else {
      novoStatus = 'entregue_parcialmente';
    }
  }

  try{
    await axios.patch(`http://localhost:3000/pedido/efetivar-pedido/${pedidoId}`,
      {
        status: novoStatus,
        estoqueId: estoqueId,
        itens:linhaPedidoItens.map((item) => ({
          id: item.id,
          qtdRecebida: item.recebido
        }))
      },
      {
        headers: { Authorization: `Bearer ${token}`}
      }
    )

    fecharPedido();
    setAlerta(alertaMensagem("Pedido finalizado com sucesso!", "success", <ReportProblemIcon/>));
    
  } catch (error) {
    console.error("Erro ao finalizar pedido", error);
    setAlerta(alertaMensagem("Erro ao finalizar pedido", "error", <ReportProblemIcon/>));

    if(axios.isAxiosError(error)){

      if(!conexaoInternet ){
        console.error("Sem acesso a internet. Verifique sua conexão", error);
        setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
        return;
      }

      if(!servidorOnline){
        console.error("Servidor fora do ar. Tente novamente em instantes", error);
        setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        return;
      }

      if(error.response){
        const status = error.response.status;
        const mensagem = error.response.data?.message || error.message;

      if(status >= 500){
          console.error(`Erro ao finalizar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else if (status === 404){
          console.error(`Erro ao finalizar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else {
          console.error(`Erro ao finalizar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
        }

        return;
      }

      if(error.code === 'ECONNABORTED'){
        console.error(`Erro ao finalizar pedido ${error}`)
        setAlerta(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
        return;
      }

      setAlerta(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
      return; 
    }
    
    fecharPedido();
  }



}

const visualizarPedido = async (pedidoId: number) => {
  const {data: {session}} = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    setAlerta(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
    return;
  }
  
  if (!session){
    setAlerta(alertaMensagem('Faça login para efetivar o pedido.', 'warning', <ReportProblemIcon/>));
    return;
  }

  if(idsSelecionados.length !== 1){
    setAlerta(alertaMensagem('Selecione apenas um pedido para realizar esta operação.', 'warning', <ReportProblemIcon/>));
    return;
  }

  try{
    const response = await axios.get(`http://localhost:3000/pedido/localizar-pedido/${pedidoId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const novoPedido: iPedido = response.data;
    console.log(novoPedido);

    gerarVisualizacaoPedidoPDF(novoPedido);
    
  }catch (error) {
    console.error("Erro ao visualizar pedido", error);
    setAlerta(alertaMensagem("Erro ao visualizar pedido", "error", <ReportProblemIcon/>));

    if(axios.isAxiosError(error)){

      if(!conexaoInternet ){
        console.error("Sem acesso a internet. Verifique sua conexão", error);
        setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
        return;
      }

      if(!servidorOnline){
        console.error("Servidor fora do ar. Tente novamente em instantes", error);
        setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        return;
      }

      if(error.response){
        const status = error.response.status;
        const mensagem = error.response.data?.message || error.message;

      if(status >= 500){
          console.error(`Erro ao visualizar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else if (status === 404){
          console.error(`Erro ao visualizar pedido${status} ${mensagem}`)
          setAlerta(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else {
          console.error(`Erro ao visualizar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
        }

        return;
      }

      if(error.code === 'ECONNABORTED'){
        console.error(`Erro ao visualizar pedido ${error}`)
        setAlerta(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
        return;
      }

      setAlerta(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
      return; 
    }
    
    fecharPedido();
  }

}

const fecharPedido = () =>{
  setCardAberto(false);
  setIsLoadingItems(false);
  setPedidoSelecionado(undefined);
  setLinhaPedidoItens([]);
  setbtnOperacao(undefined);
  setAlerta(null);
  setSelectedRows([]);
  setIdsSelecionados([]);
  setMensagemErro(null);
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event: React.ChangeEvent<unknown>, value: number) =>
        apiRef.current.setPage(value - 1)
      }
    />
  );
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
  <div className='flex items-center justify-center h-screen w-screen bg-gray-100'>
    <div className='flex flex-col items-center space-y-6 w-4/5'>
      <ButtonGroup sx={{height: 60 ,width: '100%', backgroundColor: '#FFF', padding: 1}}>
        <Button 
          onClick={() => handlecriarPedido()}
          disabled={selectedRows.length !== 0 || idsSelecionados.length !== 0 || statusAtualPedidoSelecionado === 'entregue' || statusAtualPedidoSelecionado === 'entregue_parcialmente' || statusAtualPedidoSelecionado === 'cancelado' || statusAtualPedidoSelecionado === 'pendente'}
          sx={{
            backgroundColor: "#f7931e", // laranja
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#e67e00",
            },
          }}
        >
          Criar Pedido
        </Button>

        <Button
          disabled={selectedRows.length === 0 || idsSelecionados.length === 0 || idsSelecionados.length > 1 || statusAtualPedidoSelecionado === 'cancelado'}
          sx={{
            backgroundColor: "#f44336",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={() => abrirPedido(idsSelecionados[0])}
          disabled={selectedRows.length === 0 || idsSelecionados.length === 0 || statusAtualPedidoSelecionado === 'cancelado' || statusAtualPedidoSelecionado === 'entregue' || statusAtualPedidoSelecionado === 'entregue_parcialmente' || idsSelecionados.length > 1}
          sx={{
            backgroundColor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
        >
          Efetivar
        </Button>

        <Button
          onClick={() => visualizarPedido(idsSelecionados[0])}
          disabled={selectedRows.length === 0 || idsSelecionados.length === 0 || idsSelecionados.length > 1}
          sx={{
            backgroundColor: "#2196f3",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          Visualizar
        </Button>
      </ButtonGroup>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={linhas}
          columns={colunas}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          slots={
            {pagination: CustomPagination}
          }
          onRowSelectionModelChange={(newSelection) => {
          const idsSelecionados = Array.from(newSelection.ids)

          const selecionados = linhas.filter((linha) => idsSelecionados.includes(linha.id))

          setSelectedRows(selecionados)
          setIdsSelecionados(idsSelecionados)

          if (selecionados.length === 1){
            setStatusAtualPedidoSelecionado(selecionados[0].status);
          }else{
            setStatusAtualPedidoSelecionado('');
          }



          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>

    <ModalMov/>

    {cardAberto && (
      <Box sx={{  position: 'fixed',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',zIndex: 1301,bgcolor: '#FDEFD6', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',borderRadius: '16px',width: '650px',padding: 3,border: '2px solid #f7d9a8', display: 'flex',flexDirection: 'column',gap: 2,animation: 'fadeIn 0.3s ease-in-out','@keyframes fadeIn': {from: { opacity: 0, transform: 'translate(-50%, -45%)' },to: { opacity: 1, transform: 'translate(-50%, -50%)' },},}}>
        {isLoadingItems ? (
          <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301}}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <Card>
              <CardHeader title={`Pedido nº: ${pedidoSelecionado?.id}`}/>
              <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}> <strong>Data de criação:</strong> {pedidoSelecionado?.data_criacao}</Typography>
                <Typography variant='body1'><strong>Fornecedor: {pedidoSelecionado?.fornecedor.nome}</strong></Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}> <strong>Status do pedido:</strong> {pedidoSelecionado?.status}</Typography>
              </CardContent>
            </Card>
            <DataGrid
              rows={linhaPedidoItens}
              columns={colunasPedidoItens}
              sx={{
          
          '& .celula-recebido-editavel': {
              backgroundColor: 'rgba(255, 255, 0, 0.2)', 
              color: '#333', 
              fontWeight: 'bold', 
              borderLeft: '4px solid #FFC107', 
          },
          
          '& .celula-recebido-editavel.Mui-focusVisible': {
              outline: '2px solid #1976D2', 
          },
              }}
              processRowUpdate={valorRecebido}
              initialState={{pagination:{paginationModel:{pageSize: 3},},}}
              pageSizeOptions={[3]}
              slots={{pagination: CustomPagination}}
              disableColumnSorting={true}
              disableColumnMenu={true}
              disableRowSelectionOnClick/>

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  onClick={fecharPedido} 
                  sx={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "20px",
                  border: "2px solid #fff",
                  paddingX: 3,
                  "&:hover": {
                    backgroundColor: "#D32F2F",
                  },
                }}>Cancelar</Button>
                <Button
                  onClick={() => efetivarPedido(pedidoSelecionado!.id)} 
                  sx={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "20px",
                  border: "2px solid #fff",
                  paddingX: 3,
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                }}>Finalizar</Button>
              </Stack>
          </>
          
        )}
        
      </Box>
    )}

    {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
    
  </div>
  );
}

export default PedidosCompra