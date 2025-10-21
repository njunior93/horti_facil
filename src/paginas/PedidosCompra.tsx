import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, type GridColDef, type GridRowSelectionModel} from '@mui/x-data-grid';
import { Box, CardHeader, Collapse, Typography } from '@mui/material';
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
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


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
const [pedido, setPedido] = useState<iPedido>()
const [btnOperacao, setbtnOperacao] = useState<'efetivar' | 'cancelar' | 'visualizar'>()
const [linhaPedidoItens, setLinhaPedidoItens] = useState<any[]>([]);

const estoqueContext = useEstoque();
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
    width: 90 
  },
  {
    field: 'fornecedor',
    headerName: 'Fornecedor',
    width: 200,
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
    width: 150 ,
    renderCell: (params) => {

      const status = params.value || "";
      const letra = status.charAt(0).toUpperCase();

      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "pendente":
            return "#fbc02d";
          case "efetivado":
            return "#4caf50"; 
          case "efetivado-parcial":
            return "#4caf50";
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
  
  const data = pedido.data ? new Date(pedido.data) : null;
  const dataFormatada = data ? data.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';

  return {
    id: pedido.id,
    status: pedido.status,
    dataPedido: dataFormatada,
    fornecedor: pedido.fornecedor?.nome ?? '-'
  };

});

const colunasPedidoItens: GridColDef[] = [
  { 
    field: 'id',
    headerName: 'ID', 
    width: 90 
  },
  { 
    field: 'produto',
    headerName: 'Produto', 
    width: 90,
  },
  { 
    field: 'unidade',
    headerName: 'Unidade', 
    width: 90,
  },
  { 
    field: 'minimo',
    headerName: 'Minimo', 
    width: 90,
  },
  { 
    field: 'reposicao',
    headerName: 'Solicitado', 
    width: 90,
  },
  { 
    field: 'recebido',
    headerName: 'Recebido', 
    width: 90,
    editable: true
  },
]

const criarPedido = () => {
  setTipoModal('CriarPedidoCompra');
  setHandleModal(true); 
}

const abrirPedido = async (pedidoId: number) => {

  if(idsSelecionados.length !== 1){
    setAlerta(alertaMensagem('Selecione apenas um pedido para realizar esta operação.', 'warning', <ReportProblemIcon/>));
    return;
  }

  setCardAberto(true);

  const {data : {session}} = await supabase.auth.getSession();
  const token = session?.access_token;

  try{
    const response = await axios.get(`http://localhost:3000/pedido/localizar-pedido/${pedidoId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const novoPedido = response.data;

    setPedido(novoPedido)

    if(novoPedido?.itens && Array.isArray(novoPedido.itens)){
      const linhasFormatadas = novoPedido.itens.map((item: any,index: any) =>({
        id: index +1,
        produto: item.produto?.nome || '',
        unidade: item.produto.uniMedida,
        minimo: item.produto.estoqueMinimo,
        reposicao: item.quantidade,
        recebido: item.quantidade
      }))
      setLinhaPedidoItens(linhasFormatadas)
      console.log(linhasFormatadas)

    }else{
      setLinhaPedidoItens([])
    }

  }catch(error){

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
          onClick={() => criarPedido()}
          disabled={selectedRows.length !== 0 || idsSelecionados.length !== 0}
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
          disabled={selectedRows.length === 0 || idsSelecionados.length === 0}
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
          disabled={selectedRows.length === 0 || idsSelecionados.length === 0}
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
          disabled={selectedRows.length === 0 || idsSelecionados.length === 0}
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
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>

    <ModalMov/>

    {cardAberto && (
      <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301}}>
        <Card>
          <CardHeader title={`Pedido nº: ${pedido?.id}`}/>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}> <strong>Data de criação:</strong> {pedido?.data}</Typography>
            <Typography variant='body1'><strong>Fornecedor: {pedido?.fornecedor.nome}</strong></Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}> <strong>Status do pedido:</strong> {pedido?.status}</Typography>
           </CardContent>
        </Card>
        <DataGrid
          rows={linhaPedidoItens}
          columns={colunasPedidoItens}
          initialState={{pagination:{paginationModel:{pageSize: 5},},}}
          pageSizeOptions={[5]}
          slots={{pagination: CustomPagination}}
        />
      </Box>
    )}

    {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
    
  </div>
  );
}

export default PedidosCompra