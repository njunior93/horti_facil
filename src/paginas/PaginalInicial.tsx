import { Button } from "@mui/material"
import { useContext, useState } from "react";
import { Modal, Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import alertaMensagem from "../utils/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';


const PaginalInicial = () => {

  const [open, setOpen] = useState(false)
  const abrirModal = () => setOpen(true);
  const fecharModal = () => setOpen(false);
  const navigate = useNavigate();	
  const estoqueSalvo = useContext(AppContext).estoqueSalvo;
  const [alertaEstoque, setAlertaEstoque] = useState<React.ReactNode | null>(null);

  setTimeout(() =>{
    if(alertaEstoque){
      setAlertaEstoque(null)
    }
  },4000);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6] px-4">
      <div className="flex flex-col items-center justify-center gap-3 max-w-xs text-center w-3/5 sm:1/2">  
          <h1 className="font-bold text-gray-800 leading-tight">
            <span className="block text-2xl sm:text-3xl md:text-4xl">Bem-vindo à</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl">HortiFácil</span>
          </h1>   
        <p className="mt-4 text-xs sm:text-sm md:text-lg text-gray-600 leading-tight">Sua plataforma de gestão de estoque de hortifrúti.</p>
        <Button onClick={abrirModal} variant="contained" sx={{ backgroundColor: "#FB9E3A", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#E6521F",},}}>Iniciar</Button>
      </div>

      <div className="w-2/5 sm:w-1/2">
        <img src="/logo.png" alt="Logo Inicial" width="600" height="400"/>
      </div>
   
      {alertaEstoque && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alertaEstoque}</Box>}

      <Modal
        open={open}
        onClose={fecharModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >

          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            O que deseja fazer?
          </Typography>
            <List>
            <ListItem disablePadding>
              <ListItemButton
              onClick={() => { 
                if(estoqueSalvo.id && estoqueSalvo.listaProdutos.length > 0){
                  setAlertaEstoque(alertaMensagem("Ja existe um estoque salvo. Gerencie o estoque existente", 'warning', <ReportProblemIcon/>));
                  return;
                }
                navigate('/criar-estoque'); 
                fecharModal();
                setAlertaEstoque(null) 
              }}
              sx={{
                backgroundColor: "#FDEFD6",
                borderRadius: "0.75rem",
                mb: 1,
                transition: "background 0.2s",
                '&:hover': {
                backgroundColor: "#FB9E3A",
                color: "#fff",
                },
              }}
              >
              <ListItemText primary="Criar estoque" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
              onClick={() => { 
                if (!estoqueSalvo || !estoqueSalvo.id || !estoqueSalvo.listaProdutos || estoqueSalvo.listaProdutos.length === 0) {
                  setAlertaEstoque(alertaMensagem("Não existe estoque para gerenciar. Crie um estoque", 'warning', <ReportProblemIcon />));
                  return;
                }
                
                navigate('/gerenciar-estoque'); 
                fecharModal();
                setAlertaEstoque(null)
              }}
              sx={{
                backgroundColor: "#FDEFD6",
                borderRadius: "0.75rem",
                mb: 1,
                transition: "background 0.2s",
                '&:hover': {
                backgroundColor: "#FB9E3A",
                color: "#fff",
                },
              }}
              >
              <ListItemText primary="Gerenciar estoque" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
              onClick={() => { /* ação criar pedido de compra */ fecharModal(); }}
              sx={{
                backgroundColor: "#FDEFD6",
                borderRadius: "0.75rem",
                transition: "background 0.2s",
                '&:hover': {
                backgroundColor: "#FB9E3A",
                color: "#fff",
                },
              }}
              >
              <ListItemText primary="Criar pedido de compra" />
              </ListItemButton>
            </ListItem>
            </List>
        </Box>
      </Modal>
      
    </div>
  )
}

export default PaginalInicial