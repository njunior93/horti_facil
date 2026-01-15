import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext ,useGridSelector, type GridColDef, type GridRowModel} from '@mui/x-data-grid';
import { Box, CardHeader, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useContext, useState } from 'react';
import { AppContext } from '../../../shared/context/context';
import ModalMov from '../../../shared/modals/modalMov';
import { useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import alertaMensagem from "../../../shared/components/alertaMensagem";
import axios from 'axios';
import { 
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';
import { useEstoque } from '../../estoque/provider/EstoqueProvider.tsx';
import { useNavigate } from "react-router-dom";
import type { iPedido } from '../type/iPedido.ts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type {LinhaItem} from '../type/iLinhaItem.ts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useInternet } from '../../../providers/StatusServidorProvider';
import { gerarVisualizacaoPedidoPDF } from '../../../utils/gerarVisualizacaoPedidoPDF.ts';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale/pt-BR'
import {gerarFiltrosListaPedidosPDF} from '../../../utils/gerarFiltrosListaPedidosPDF'

const PedidosCompra = () => {

const [mensagemErro, setMensagemErro] = useState<React.ReactNode | null>(null);
const setTipoModal = useContext(AppContext).setTipoModal;
const { setHandleModal} = useContext(AppContext);
const {setEstoqueSalvo} = useContext(AppContext);
const {listaFornecedores, setListaFornecedores} = useContext(AppContext);
const {listaPedidosCompra, setListaPedidosCompra } = useContext(AppContext);
const [listaPedidoFiltrados, setListaPedidoFiltrados] = useState<iPedido[]>([]);
const { estoqueId, setEstoqueId } = useContext(AppContext);
const [selectedRows, setSelectedRows] = useState<any[]>([]);
const [idsSelecionados, setIdsSelecionados] = useState<any[]>([]);
const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
const navigate = useNavigate();
const [cardAberto, setCardAberto] = useState(false);
const [pedidoSelecionado, setPedidoSelecionado,] = useState<iPedido>()
const [, setbtnOperacao] = useState<'efetivar' | 'cancelar' | 'visualizar'>()
const [linhaPedidoItens, setLinhaPedidoItens] = useState<LinhaItem[]>([]);
const [isLoadingItems, setIsLoadingItems] = useState(true);
const estoqueContext = useEstoque();
const StatusServidorContext = useInternet();
const [statusPedido, setStatusPedido] = useState<string>('pendente');
const [statusAtualPedidoSelecionado, setStatusAtualPedidoSelecionado] = useState<string>('');
const [openCancelamento, setOpenCancelamento] = useState(false);
const [pedidoIdParaCancelar, setPedidoIdParaCancelar] = useState<number | null>(null);
const {setOrigemDoModal} = useContext(AppContext);

const [todos, setTodos] = useState(true);
const [pendente, setPendente] = useState(true);
const [entregue, setEntregue] = useState(true);
const [entregueParcial, setEntregueParcial] = useState(true);
const [cancelado, setCancelado] = useState(true);
const [dataFiltroInicioCriacao, setDataFiltroInicioCriacao] = useState<Date | null>(null);
const [dataFiltroFimCriacao, setDataFiltroFimCriacao,] = useState<Date | null>(null);
const [dataFiltroInicioEfetiv, setDataFiltroInicioEfetiv] = useState<Date | null>(null);
const [dataFiltroFimEfetiv, setDataFiltroFimCEfetiv] = useState<Date | null>(null);
const [dataFiltroInicioCancelamento, setDataFiltroInicioCancelamento] = useState<Date | null>(null);
const [dataFiltroFimCancelamento, setDataFiltroFimCancelamento] = useState<Date | null>(null);
const [fornecedorFiltro, setFornecedorFiltro] = useState<string>('Todos');

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


    checarEstoque();
    fetchEstoqueId();
    fetchlistaFornecedores();
    fetchListaProdutos();
    fetchListaPedidosCompra();
    
    
}, []); 

// useEffect(() => {
//   if (idsSelecionados.length === 0) {
//     setSelectedRows([]);
//     return;
//   }

//   const atualizados = idsSelecionados.map(id => listaPedidosCompra.find(p => String(p.id) === String(id))).filter(Boolean);

//   setSelectedRows(atualizados);

// }, [listaPedidosCompra]);



useEffect(() => {

  atualizarLista();

}, [pendente,entregue,entregueParcial,cancelado, dataFiltroInicioCriacao, dataFiltroFimCriacao, dataFiltroInicioEfetiv, dataFiltroFimEfetiv, dataFiltroInicioCancelamento, dataFiltroFimCancelamento, fornecedorFiltro, listaPedidosCompra]);

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
      // setListaPedidoFiltrados(response.data);

      return response.data;

    } catch (error) {
      if(axios.isAxiosError(error) && error.response){
        setMensagemErro(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
      } else {
        setMensagemErro(alertaMensagem(`Ocorreu um erro ao buscar os pedidos de compra. Tente novamente. ${error}`, 'error', <ReportProblemIcon />));
      }
  }

  };

const atualizarLista = () =>{
  let filtrados = listaPedidosCompra.filter((pedido) =>{

    const filtrosStatus = [];

    if(pendente) filtrosStatus.push('pendente');
    if(entregue) filtrosStatus.push('entregue');
    if(entregueParcial) filtrosStatus.push('entregue_parcialmente');
    if(cancelado) filtrosStatus.push('cancelado');

    const passaStatus = filtrosStatus.includes(pedido.status);

    if(!passaStatus) return false;

    //------------------

    if(fornecedorFiltro && fornecedorFiltro !== 'Todos'){
      const fornecedorAchado = listaFornecedores.find(f => f.nome === fornecedorFiltro);

      if(!fornecedorAchado){
        return false;
      }

      const nomeFornecedor = fornecedorAchado.nome

      if(pedido.fornecedor.nome !== nomeFornecedor){
        return false;
      }

    }
    


    //-------------------

    const inicioCriacao = dataFiltroInicioCriacao ? new Date(new Date(dataFiltroInicioCriacao).setHours(0, 0, 0, 0)) : null;

    const fimCriacao = dataFiltroFimCriacao  ? new Date(new Date(dataFiltroFimCriacao).setHours(23, 59, 59, 999)) : null;

    const inicioEfetiv = dataFiltroInicioEfetiv ? new Date(new Date(dataFiltroInicioEfetiv).setHours(0, 0, 0, 0)) : null;

    const fimEfetiv = dataFiltroFimEfetiv ? new Date(new Date(dataFiltroFimEfetiv).setHours(23, 59, 59, 999)) : null;

    const inicioCanc = dataFiltroInicioCancelamento ? new Date(new Date(dataFiltroInicioCancelamento).setHours(0,0,0,0)) : null;

    const fimCanc = dataFiltroFimCancelamento ? new Date(new Date(dataFiltroFimCancelamento).setHours(23,59,59,999)) : null

    //-------------------

    const dataCriacao = new Date(pedido.data_criacao);

    if (inicioCriacao && dataCriacao < inicioCriacao) {
      return false;
    }

    if (fimCriacao && dataCriacao > fimCriacao) {
      return false;
    }

    if (inicioEfetiv || fimEfetiv) {

      if (!pedido.data_efetivacao) {
        return false;
      }

      const dataEfetiv = new Date(pedido.data_efetivacao);

      if (inicioEfetiv && dataEfetiv < inicioEfetiv) {
        return false;
      }

      if (fimEfetiv && dataEfetiv > fimEfetiv) {
        return false;
      }
    }

    if(inicioCanc || fimCanc){
      if(!pedido.data_cancelamento){
        return false;
      }

      const dataCanc = new Date(pedido.data_cancelamento);

      if(inicioCanc && dataCanc < inicioCanc){
        return false;
      }

      if(fimCanc && dataCanc > fimCanc){
        return false;
      }
    }

    return true;

  });

  setListaPedidoFiltrados(filtrados);

}

const fecharPedido = () =>{
  setCardAberto(false);
  setIsLoadingItems(false);
  setPedidoSelecionado(undefined);
  setLinhaPedidoItens([]);
  setbtnOperacao(undefined);
  setAlerta(null);
  // setSelectedRows([]);
  // setIdsSelecionados([]);
  setMensagemErro(null);
  // setStatusAtualPedidoSelecionado('');
  setOpenCancelamento(false);
  setPedidoIdParaCancelar(null);
}

const sair = () => {
  navigate("/pagina-inicial");
  setTipoModal('');
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
    field: 'dataEfetivacao',
    headerName: 'Data de efetivação',
    width: 150,
    editable: false,
  },
  {
    field: 'dataCancelamento',
    headerName: 'Data de cancelamento',
    width: 180,
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

const linhas = listaPedidoFiltrados.map((pedido) => {
  
  const data = pedido.data_criacao ? new Date(pedido.data_criacao) : null;
  const dataFormatada = data ? data.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;

  return {
    id: pedido.id,
    status: pedido.status,
    dataPedido: dataFormatada,
    dataEfetivacao: pedido.data_efetivacao ? new Date(pedido.data_efetivacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null,
    dataCancelamento: pedido.data_cancelamento ? new Date(pedido.data_cancelamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null,
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
  
  if(!conexaoInternet ){
      setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
  }
  
  if(!servidorOnline){
    setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
    return;
  }

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

   if(!conexaoInternet ){
      setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
  }
  
  if(!servidorOnline){
    setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
    return;
  }
  
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

    
    const listaAtualizada = await fetchListaPedidosCompra();
    const pedidoAtualizado = listaAtualizada.find((pedido: iPedido) => pedido.id === pedidoId);

    if(pedidoAtualizado){
      setStatusAtualPedidoSelecionado(pedidoAtualizado?.status);
    }
    
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

  
  if(!conexaoInternet ){
      setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
  }
  
  if(!servidorOnline){
    setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
    return;
  }

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

const cancelarPedido = async (pedidoId: number) =>{
  setPedidoIdParaCancelar(pedidoId);
  setOpenCancelamento(true); 
}

const cancelamentoPedido = async () =>{
  if (!pedidoIdParaCancelar){
    return;
  }

  setOpenCancelamento(false);

  
  if(!conexaoInternet ){
      setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
  }
  
  if(!servidorOnline){
    setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
    return;
  }

  const {data: {session}} = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    setAlerta(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
    return;
  }
  
  if (!session){
    setAlerta(alertaMensagem('Faça login para cancelar o pedido.', 'warning', <ReportProblemIcon/>));
    return;
  }

  if(idsSelecionados.length !== 1){
    setAlerta(alertaMensagem('Selecione apenas um pedido para realizar esta operação.', 'warning', <ReportProblemIcon/>));
    return;
  }

  try{
    const response = await axios.get(`http://localhost:3000/pedido/localizar-pedido/${pedidoIdParaCancelar}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
  });

  const horarioAtual = new Date().getTime();
  const horarioPedido = new Date(response.data.data_criacao).getTime();

  const diferencaHoras = horarioAtual - horarioPedido;

  const horaDia = 24 * 60 * 60 * 1000;

  const limite24horas = diferencaHoras > horaDia;

  if (limite24horas && (response.data.status === 'entregue' || response.data.status === 'entregue_parcialmente')){
    setAlerta(alertaMensagem("O pedido não pode ser cancelado após 24 horas de sua criação.", "warning", <ReportProblemIcon/>));
    return;
  }

  const pedidoCancelado = await axios.patch(`http://localhost:3000/pedido/cancelar-pedido/${pedidoIdParaCancelar}`, 
    {
      estoqueId: estoqueId
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  
  const listaAtualizada = await fetchListaPedidosCompra();

  setSelectedRows(prev => prev.map(selecionado => listaAtualizada.find((p: { id: any; }) => p.id === selecionado.id) || selecionado));

  setIdsSelecionados(prev =>prev.filter(id => listaAtualizada.some((p: { id: any; }) => p.id === id)));


  const pedidoAtualizado = listaAtualizada.find((pedido: iPedido) => pedido.id === pedidoCancelado.data.id);

  if(pedidoAtualizado){
    setStatusAtualPedidoSelecionado(pedidoAtualizado?.status);
  }

  fecharPedido();
  setAlerta(alertaMensagem(`Pedido Nº ${pedidoIdParaCancelar} cancelado!`, 'success', <CheckCircleIcon/>));

  } catch (error) {
    console.error("Erro ao cancelar pedido", error);
    setAlerta(alertaMensagem("Erro ao cancelar pedido", "error", <ReportProblemIcon/>));

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
          console.error(`Erro ao cancelar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else if (status === 404){
          console.error(`Erro ao cancelar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else {
          console.error(`Erro ao cancelar pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
        }

        return;
      }

      if(error.code === 'ECONNABORTED'){
        console.error(`Erro ao cancelar pedido ${error}`)
        setAlerta(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
        return;
      }

      setAlerta(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
      return; 
    }

    fecharPedido();

  }

}

const excluirPedido = async (pedidosId: number[]) =>{

  if(!conexaoInternet ){
      setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
  }
  
  if(!servidorOnline){
    setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
    return;
  }

  const {data: {session}} = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    setAlerta(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
    return;
  }
  
  if (!session){
    setAlerta(alertaMensagem('Faça login para excluir o pedido.', 'warning', <ReportProblemIcon/>));
    return;
  }

  for(const pedido of selectedRows){
    if(pedido.dataEfetivacao){
      setAlerta(alertaMensagem('Somente pedidos não efetivados podem ser excluídos.', 'warning', <ReportProblemIcon/>));
      return;
    }
  }

  try{

    await axios.delete(`http://localhost:3000/pedido/excluir-pedido`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          pedidoId: pedidosId,
          estoqueId: estoqueId  
        }
      },
    );

    const listaAtualizada = await fetchListaPedidosCompra();

    if (pedidosId.length === 1) {
      const pedidoAtualizado = listaAtualizada.find(
        (pedido: iPedido) => pedido.id === pedidosId[0]
      );
    
      setStatusAtualPedidoSelecionado(pedidoAtualizado?.status);

    }


  } catch (error) {
    console.error("Erro ao excluir pedido", error);
    setAlerta(alertaMensagem("Erro ao xcluir  pedido", "error", <ReportProblemIcon/>));

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
          console.error(`Erro ao excluir  pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else if (status === 404){
          console.error(`Erro ao excluir  pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
        } else {
          console.error(`Erro ao excluir  pedido ${status} ${mensagem}`)
          setAlerta(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
        }

        return;
      }

      if(error.code === 'ECONNABORTED'){
        console.error(`Erro ao excluir pedido ${error}`)
        setAlerta(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
        return;
      }

      setAlerta(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
      return; 
    }

    fecharPedido();

  }
      
}

const handleTodos = (checked: boolean) =>{
  setTodos(checked);
  setPendente(checked);
  setEntregue(checked);
  setEntregueParcial(checked);
  setCancelado(checked);
}

const atualizarTodos = (pendente: boolean, entregue: boolean, entregueParcial: boolean, cancelado: boolean) => {
  setTodos(pendente && entregue && entregueParcial && cancelado);
}

const salvarFiltro = async () =>{

  const {data: {session}} = await supabase.auth.getSession();
  const token = session?.access_token;

  if(!conexaoInternet ){
      setAlerta(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
  }
  
  if(!servidorOnline){
    setAlerta(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
    return;
  }
  
  if (!token) {
    setAlerta(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
    return;
  }
  
  if (!session){
    setAlerta(alertaMensagem('Faça login para excluir o pedido.', 'warning', <ReportProblemIcon/>));
    return;
  }

  const filtrosUtilizados = {
    status:{
      todos,
      pendente,
      entregue,
      entregueParcial,
      cancelado
    },
    datas:{
      criacao:{
        inicio: dataFiltroInicioCriacao,
        fim: dataFiltroFimCriacao
      },
      efetivacao:{
        inicio: dataFiltroInicioEfetiv,
        fim: dataFiltroFimEfetiv
      },
      cancelamento:{
        inicio: dataFiltroInicioCancelamento,
        fim: dataFiltroFimCancelamento
      }
    },
    fornecedor: fornecedorFiltro
  };

  try{

    gerarFiltrosListaPedidosPDF(listaPedidoFiltrados, filtrosUtilizados);

  } catch(error){
    setAlerta(alertaMensagem("Erro ao gerar relatorio", "error", <ReportProblemIcon/>));
  }
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
      onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
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
  <div className='flex justify-center items-center min-h-screen w-full bg-gray-100 py-6'>
    <div className='max-w-7xl mx-auto bg-white p-6 rounded shadow'>
      <div className='w-5/5'>
        <div className='flex justify-between border-b-4 border-[#FDEFD6]'>
          <ButtonGroup sx={{height: 60 ,width: '100%', backgroundColor: '#FFF', padding: 1}}>
            <Button 
              onClick={() => {handlecriarPedido(); setOrigemDoModal('modalCriarPedido');}}
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
              onClick={() => cancelarPedido(idsSelecionados[0])}
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

              <Dialog open={openCancelamento} onClose={() => setOpenCancelamento(false)}>
              <DialogTitle>Pedido Nº {pedidoIdParaCancelar}</DialogTitle>
              <DialogContent>
                Tem certeza que deseja cancelar este pedido?
                {statusAtualPedidoSelecionado === 'entregue' || statusAtualPedidoSelecionado === 'entregue_parcialmente' ? (
                  <Typography sx={{ color: 'red', marginTop: 1, fontSize: 12}}>
                    * Atenção: Prazo de 24 horas para cancelamento de um pedido efetivado
                  </Typography>
                ) : (
                  <></>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenCancelamento(false)} color="error" variant="contained">Não</Button>
                <Button onClick={cancelamentoPedido} color="success" variant="contained">
                  Sim
                </Button>
              </DialogActions>
              </Dialog>

            <Button
              onClick={() => excluirPedido(idsSelecionados)}
              disabled={selectedRows.length === 0 || idsSelecionados.length === 0 || selectedRows.some((pedido) => pedido.status === 'entregue') || selectedRows.some((pedido) => pedido.status === 'entregue_parcialmente') || selectedRows.some((pedido) => pedido.status === 'pendente' || !selectedRows.every((pedido) =>pedido.status === "cancelado" &&(!pedido.data_efetivacao || pedido.data_efetivacao === null)))}
              sx={{
                backgroundColor: "#fffb00ff",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "20px",
                border: "2px solid #fff",
                paddingX: 3,
                "&:hover": {
                  backgroundColor: "#dbcf27ff",
                },
              }}
            >
              Excluir
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

          <ButtonGroup>
            <Button
              onClick={() => {
                setTipoModal('CadastroFornecedor');
                setHandleModal(true);
                setOrigemDoModal('paginaPedido')
              }}
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
              Fornecedor
            </Button>

            <Button
              onClick={() => {
                navigate('/pagina-inicial'); 
                fecharPedido();
                setSelectedRows([]);
                setIdsSelecionados([]);
                setStatusAtualPedidoSelecionado('');

              }}
              sx={{
                backgroundColor: "#494949ff", // laranja
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "20px",
                border: "2px solid #fff",
                paddingX: 3,
                "&:hover": {
                  backgroundColor: "#1d1c1cff",
                },
              }}
            >
              Sair
            </Button>
          </ButtonGroup>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md w-full">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Filtros
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-gray-50 p-4 rounded-lg border">
              <FormControl component="fieldset" className="w-full">
                <FormLabel component="legend" className="font-semibold text-gray-700 mb-2">Status do Pedido</FormLabel>

                <FormGroup className="flex flex-wrap gap-x-4 gap-y-2">
                  <FormControlLabel label="Todos" control={<Checkbox checked={todos} 
                    onChange={(e) => handleTodos(e.target.checked)} />}/>

                  <FormControlLabel label="Pendente" control={
                    <Checkbox checked={pendente} 
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setPendente(checked);
                        atualizarTodos(checked, entregue, entregueParcial, cancelado);
                      }}/>
                  }/>

                  <FormControlLabel label="Entregue" control={<Checkbox checked={entregue} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEntregue(checked);
                      atualizarTodos(pendente, checked, entregueParcial, cancelado);
                    }} />
                  }/>

                  <FormControlLabel label="Entregue parcialmente" control={<Checkbox checked={entregueParcial} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEntregueParcial(checked);
                      atualizarTodos(pendente, entregue, checked, cancelado);
                    }} />
                  }/>
                  <FormControlLabel label="Cancelado" control={<Checkbox checked={cancelado} 
                      onChange={(e) => {
                      const checked = e.target.checked;
                      setCancelado(checked);
                      atualizarTodos(pendente, entregue, entregueParcial, checked);
                    }} />
                  }/>
                </FormGroup>
              </FormControl>
            </div>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <div className="bg-gray-50 p-4 rounded-lg border flex flex-col gap-4">

                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-gray-700">Dt. Criação</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Data início"
                      value={dataFiltroInicioCriacao}
                      maxDate={dataFiltroFimCriacao || undefined}
                      slotProps={{
                      field: {
                        clearable: true, 
                        onClear: () => {setDataFiltroInicioCriacao(null);}, 
                      },
                    }}
                      onChange={(valor) => {
                        if (dataFiltroFimCriacao && valor && valor > dataFiltroFimCriacao) {
                          setAlerta(alertaMensagem(
                            'Data inicial não pode ser maior que a final',
                            'warning',
                            <ReportProblemIcon />
                          ));
                        } else {
                          setAlerta(null);
                          setDataFiltroInicioCriacao(valor);
                        }
                      }}
                    />

                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Data fim"
                      value={dataFiltroFimCriacao}
                      minDate={dataFiltroInicioCriacao || undefined}
                      slotProps={{
                      field: {
                        clearable: true, 
                        onClear: () => {setDataFiltroFimCriacao(null);}, 
                      },
                    }}
                      onChange={(valor) => {
                        if (dataFiltroInicioCriacao && valor && valor < dataFiltroInicioCriacao) {
                          setAlerta(alertaMensagem('Data final não pode ser maior que a inicial','warning',<ReportProblemIcon />));
                        } else {
                          setAlerta(null);
                          setDataFiltroFimCriacao(valor);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-gray-700">Dt. Efetivação</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Data início"
                      value={dataFiltroInicioEfetiv}
                      maxDate={dataFiltroFimEfetiv || undefined}
                      slotProps={{
                      field: {
                        clearable: true, 
                        onClear: () => {setDataFiltroInicioEfetiv(null);}, 
                      },
                    }}
                      onChange={(valor) => {
                        if (dataFiltroFimEfetiv && valor && valor > dataFiltroFimEfetiv) {
                          setAlerta(alertaMensagem('Data inicial não pode ser maior que a final','warning',<ReportProblemIcon />));
                        } else {
                          setAlerta(null);
                          setDataFiltroInicioEfetiv(valor);
                        }
                      }}
                    />

                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Data fim"
                      value={dataFiltroFimEfetiv}
                      minDate={dataFiltroInicioEfetiv || undefined}
                      slotProps={{
                      field: {
                        clearable: true, 
                        onClear: () => {setDataFiltroFimCEfetiv(null);}, 
                      },
                    }}
                      onChange={(valor) => {
                        if (dataFiltroInicioEfetiv && valor && valor < dataFiltroInicioEfetiv) {
                          setAlerta(alertaMensagem('Data final não pode ser maior que a inicial','warning',<ReportProblemIcon />
                          ));
                        } else {
                          setAlerta(null);
                          setDataFiltroFimCEfetiv(valor);
                        }
                      }}
                      
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-gray-700">Dt. Cancelamento</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Data início"
                      value={dataFiltroInicioCancelamento}
                      maxDate={dataFiltroFimCancelamento || undefined}
                      slotProps={{
                      field: {
                        clearable: true, 
                        onClear: () => {setDataFiltroInicioCancelamento(null);}, 
                      },
                    }}
                      onChange={(valor) => {
                        if (dataFiltroFimCancelamento && valor && valor > dataFiltroFimCancelamento) 
                          {setAlerta(alertaMensagem('Data inicial não pode ser maior que a final','warning',<ReportProblemIcon />
                          ));
                        } else {
                          setAlerta(null);
                          setDataFiltroInicioCancelamento(valor);
                        }
                      }}
                      
                    />

                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Data fim"
                      value={dataFiltroFimCancelamento}
                      minDate={dataFiltroInicioCancelamento || undefined}
                      slotProps={{
                      field: {
                        clearable: true, 
                        onClear: () => {setDataFiltroFimCancelamento(null);}, 
                      },
                    }}
                      onChange={(valor) => {
                        if (dataFiltroInicioCancelamento && valor && valor < dataFiltroInicioCancelamento) {
                          setAlerta(alertaMensagem('Data final não pode ser maior que a inicial','warning',<ReportProblemIcon />));
                        } else {
                          setAlerta(null);
                          setDataFiltroFimCancelamento(valor);
                        }
                      }}
                    />
                  </div>
                </div>

              </div>
            </LocalizationProvider>

          </div>

          <div className="mt-6">
            <FormControl fullWidth>
              <InputLabel id="fornecedor-label">Selecione o fornecedor</InputLabel>
              <Select
                labelId="fornecedor-label"
                id="fornecedor-select"
                value={fornecedorFiltro}
                label="Selecione o fornecedor"
                onChange={(e) => setFornecedorFiltro(e.target.value)}>
                <MenuItem value="Todos">Todos</MenuItem>
                {listaFornecedores.map((f) => (
                  <MenuItem key={f.id} value={f.nome}>{f.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

        <Button onClick={salvarFiltro} variant="contained" className="mt-6"> Salvar Filtro</Button>
        </div>
      </div>

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

    <ModalMov atualizarPedidos={fetchListaPedidosCompra}/>

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
              checkboxSelection={false}
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