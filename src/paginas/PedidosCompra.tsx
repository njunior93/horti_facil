import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { AppContext } from '../context/context';
import ModalMov from '../utils/modalMov';



const colunas: GridColDef<(typeof linhas)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
   { field: 'status', headerName: 'Status', width: 90 },
  {
    field: 'tipoPedido',
    headerName: 'Tipo do pedido',
    width: 150,
    editable: false,
  },
  {
    field: 'dataPedido',
    headerName: 'Data Pedido',
    width: 150,
    editable: false,
  },
  {
    field: 'fornecedor',
    headerName: 'Fornecedor',
    width: 110,
    editable: true,
  }
];

const linhas = [
  { id: 1,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 2,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 3,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 4,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 5,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 6,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 7,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 8,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
  { id: 9,status: 'Efetivado', tipoPedido: 'Snow', dataPedido: 'Jon', fornecedor: 'Calamo'},
];


const PedidosCompra = () => {

const setTipoModal = useContext(AppContext).setTipoModal;
const {handleModal, setHandleModal} = useContext(AppContext);


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