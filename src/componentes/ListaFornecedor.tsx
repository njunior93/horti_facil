import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import type { iFornecedor } from "../type/iFornecedor";
import { supabase } from "../supabaseClient";
import axios from "axios";
import alertaMensagem from "../utils/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';


const ListaFornecedor = () => {

  const {listaFornecedores, setListaFornecedores} = useContext(AppContext);
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const [abrir, setAbrir] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<iFornecedor | null>(null);


  setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);

  const estiloModal: React.CSSProperties = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          padding: '24px',
    };

  const handleAbrirDialog = (fornecedor: iFornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setAbrir(true);
  }

  const handleFecharDialog = () => {
    setAbrir(false);
    setFornecedorSelecionado(null);
  }

  const abrirModalEditar = (fornecedor: iFornecedor) => {
    setModalAberto(true);
    setFornecedorSelecionado(fornecedor);
  }

  const fecharModalEditar = () => {
    setModalAberto(false);
    setFornecedorSelecionado(null);
  }

  const excluirFornecedor = async (fornecedor: iFornecedor) => {

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      alert('Token não encontrado');
      return;
    }

    try{
      await axios.delete(`http://localhost:3000/fornecedor/excluir-fornecedor/${fornecedor.id}`, {
      headers: { Authorization: `Bearer ${token}`}
    });

      setListaFornecedores(listaFornecedores.filter(f => f.id !== fornecedor.id));
    } catch (error) {
      setAlerta(alertaMensagem('Erro ao excluir fornecedor',  'warning', <ReportProblemIcon/>));
    }   

  }
 
  return (
    <div className='bg-[#EAEFEF] h-32 mt-2 overflow-auto text-sm' >
      <div className={`grid grid-cols-6 items-center p-2 border-b text-center`}>
        <div className="font-medium">Razão</div>
        <div>Celular</div>
        <div>Email</div>  
        <div>Noti whats</div>
        <div>Noti email</div>
        <div>Ação</div>
      </div>

       {listaFornecedores.map((fornecedor) => (
        <div key={fornecedor.id} className={`grid grid-cols-6 items-center p-2 border-b text-center`}>
          <div>{fornecedor.nome}</div>
          <div>{fornecedor.whatsApp}</div>
          <div>{fornecedor.email}</div>         
          <div>{fornecedor.noti_whatsapp ? "Sim" : "Não"}</div>
          <div>{fornecedor.noti_email ? "Sim" : "Não"}</div>
          <div>
          <Button startIcon={<EditIcon/>}></Button>
          <Button onClick={() => handleAbrirDialog(fornecedor)}  startIcon={<PersonRemoveIcon/>}></Button>
          </div>
          
        </div>
      ))}

      
      {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
      
      <Dialog
        open={abrir}
        onClose={handleFecharDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este fornecedor? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{
            backgroundColor: "#f44336", // vermelho
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#d32f2f",
            },}}  
            onClick={handleFecharDialog} color="error" autoFocus>Cancelar</Button>
          <Button sx={{
            backgroundColor: "#f7931e", // laranja
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#e67e00",
            },}} 
            onClick={() => {if (fornecedorSelecionado) {excluirFornecedor(fornecedorSelecionado)} handleFecharDialog();}}>Excluir</Button>     
        </DialogActions>
      </Dialog>

      <Modal
              open={modalAberto}
              onClose={(reason) => {
                if (reason === 'backdropClick') return;
                fecharModalEditar();
              }}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box sx={estiloModal}>
              <Typography variant="h6" gutterBottom>
                Informe o novo estoque: {fornecedorSelecionado.nome}
              </Typography>
      
              <Stack spacing={3}>
                <TextField
                  label="Razão Social"
                  type="number"
                  fullWidth
                  value={estoqueAtual}
                  onChange={(e) => setEstoqueAtual(Number(e.target.value))}
                />
                <TextField
                  label="Estoque Mínimo"
                  type="number"
                  fullWidth
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
                />
                <TextField
                  label="Estoque Máximo"
                  type="number"
                  fullWidth
                  value={estoqueMaximo}
                  onChange={(e) => setEstoqueMaximo(Number(e.target.value))}
                />
      
                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                  <Button variant="outlined" onClick={fecharModalEditar}>
                    Cancelar
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => salvarEdicao(produtoSelecionadoEdicao)}>
                    Salvar
                  </Button>
                </Stack>
              </Stack>
            </Box>
            </Modal>

    </div>
  )
}

export default ListaFornecedor