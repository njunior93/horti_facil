import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
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


const PedidosCompra = () => {

const [mensagemErro, setMensagemErro] = useState<React.ReactNode | null>(null);
const setTipoModal = useContext(AppContext).setTipoModal;
const { setHandleModal} = useContext(AppContext);
const {estoqueSalvo, setEstoqueSalvo} = useContext(AppContext);
const {listaFornecedores, setListaFornecedores} = useContext(AppContext);
const { listaPedidosCompra, setListaPedidosCompra } = useContext(AppContext);
const { estoqueId, setEstoqueId } = useContext(AppContext);

 setTimeout(() =>{
    if(mensagemErro){
      setMensagemErro(null)
    }
  },4000);

useEffect(() => {
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

    fetchEstoqueId();
    fetchlistaFornecedores();
    fetchListaProdutos();
    fetchListaPedidosCompra();
    
}, []);

const colunas: GridColDef<(typeof linhas)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
   { field: 'status', headerName: 'Status', width: 90 },
  {
    field: 'dataPedido',
    headerName: 'Data de criação',
    width: 150,
    editable: false,
  },
  {
    field: 'fornecedor',
    headerName: 'Fornecedor',
    width: 110,
    editable: false,
  }
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


const criarPedido = () => {
  setTipoModal('CriarPedidoCompra');
  setHandleModal(true); 
}

  return (
  <div className='flex items-center justify-center h-screen w-screen bg-gray-100'>
    <div className='flex flex-col items-center space-y-6 w-4/5'>
      <ButtonGroup sx={{height: 60 ,width: '100%', backgroundColor: '#FFF', padding: 1}}>
        <Button onClick={() => criarPedido()}
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
          sx={{
            backgroundColor: "#f44336", // vermelho
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
          sx={{
            backgroundColor: "#4caf50", // verde (exemplo)
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
          sx={{
            backgroundColor: "#2196f3", // azul (exemplo)
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
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>

    <ModalMov/>
  </div>
  );
}

export default PedidosCompra