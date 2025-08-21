import { Button } from "@mui/material"
import { useContext, useState } from "react";
import { Modal, Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import alertaMensagem from "../utils/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const PaginalInicial = () => {

  const [open, setOpen] = useState(false)
  const abrirModal = () => setOpen(true);
  const fecharModal = () => setOpen(false);
  const navigate = useNavigate();	
  const estoqueSalvo = useContext(AppContext).estoqueSalvo;
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const {session} = useAuth();

  const dadosUsuario: any | undefined = session?.user.user_metadata;

  setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);

  if (loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6]">
        <p className="text-xs md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg">
          Carregando...
        </p>
      </div>
    );
  }

  const iniciar = async () =>{

    if (!session){
      setAlerta(alertaMensagem('Faça login para gerenciar seu estoque.', 'warning', <ReportProblemIcon/>));
      navigate('/');
    }

    const token = session?.access_token;
    if (!token){
      setAlerta(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
      navigate("/");
    }

    try{
      const response = await axios.get('http://localhost:3000/estoque/verificar-estoque', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      navigate('/criar-estoque'); 
      fecharModal();
      setAlerta(null) 

      if (response.data.existe){
        setAlerta(alertaMensagem("Já existe um estoque salvo. Gerencie o estoque existente.", 'warning', <ReportProblemIcon/>));
      } else{
        setOpen(true)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response){
        setAlerta(alertaMensagem(`Erro: ${error.response.data.message}`, 'warning', <ReportProblemIcon/>));          
      } else {
        setAlerta(alertaMensagem('Não foi possível verificar o estoque.', 'warning', <ReportProblemIcon/>));
      }
    }
  };

  const sairLogout = async () =>{
    try{
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error){
        throw error;
      }
      navigate('/');

    } catch (error: unknown){
      if (error instanceof Error){
        setAlerta(alertaMensagem(`Erro ao fazer logout: ${error.message}`, 'warning', <ReportProblemIcon/>));
      } else {
        setAlerta(alertaMensagem(`Erro desconhecido`, 'warning', <ReportProblemIcon/>));
      }      

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6] px-4">
      <div className="flex flex-col items-center justify-center gap-3 max-w-xs text-center w-3/5 sm:1/2">  
          <h1 className="font-bold text-gray-800 leading-tight">
            <span className="block text-2xl sm:text-3xl md:text-4xl">Bem-vindo {dadosUsuario.name}</span>
          </h1>   
        <p className="mt-4 text-xs sm:text-sm md:text-lg text-gray-600 leading-tight">Sua plataforma de gestão de estoque de hortifrúti.</p>
        <div className="flex gap-3">
          <Button onClick={abrirModal} variant="contained" sx={{ backgroundColor: "#FB9E3A", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#E6521F",},}}>Iniciar</Button>
          <Button onClick={sairLogout} variant="contained" sx={{ backgroundColor: "#fb473aff", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#E6521F",},}}>Sair</Button>
        </div>
      </div>

      <div className="w-2/5 sm:w-1/2">
        <img src="/logo.png" alt="Logo Inicial" width="600" height="400"/>
      </div>
   
      {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}

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
              onClick={iniciar}
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
                if (!estoqueSalvo || !estoqueSalvo.listaProdutos || estoqueSalvo.listaProdutos.length === 0) {
                  setAlerta(alertaMensagem("Não existe estoque para gerenciar. Crie um estoque", 'warning', <ReportProblemIcon />));
                  return;
                }
                
                navigate('/gerenciar-estoque'); 
                fecharModal();
                setAlerta(null)
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