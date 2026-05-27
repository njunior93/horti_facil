import { Button } from "@mui/material"
import { useEffect, useState } from "react";
import { Modal, Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import alertaMensagem from "../shared/components/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { supabase } from "../supabaseClient";
import { useAuth } from "../shared/context/AuthContext";
import { useInternet} from '../providers/StatusServidorProvider';
import { useEstoque } from '../features/estoque/provider/EstoqueProvider.tsx';

const PaginalInicial = () => {

  const [open, setOpen] = useState(false)
  const abrirModal = () => setOpen(true);
  const fecharModal = () => setOpen(false);
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const {session} = useAuth();
  const StatusServidorContext = useInternet();
  const estoqueContext = useEstoque();

  const existeEstoque = estoqueContext?.existeEstoque;
  const servidorOnline = StatusServidorContext?.servidorOnline ?? null;

  const mensagemServicosOffline = () => {
    if (servidorOnline === null) return "Verificando serviços, aguarde um instante...";
    return "Servidor indisponível. Tente novamente em instantes.";
  };

  const dadosUsuario: any | undefined = session?.user.user_metadata;

  useEffect(() => {
       if (!alerta) return;
  
      const timer = setTimeout(() => {
        setAlerta(null);
      }, 4000);
  
      return () => clearTimeout(timer);
      }, [alerta]);

  if (loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6]">
        <p className="text-xs md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg">
          Carregando...
        </p>
      </div>
    );
  }

  const criarEstoque = async () =>{

    try{

      if (!servidorOnline){
        setAlerta(alertaMensagem(mensagemServicosOffline(), 'warning', <ReportProblemIcon />));
        return;
      }

      if(existeEstoque){
        setAlerta(alertaMensagem("Ja existe estoque criado. Gerencie o seu estoque", 'warning', <ReportProblemIcon />));
        return;
      }   
   
      navigate('/criar-estoque'); 
      fecharModal();
      setAlerta(null) 
      setOpen(true)
    
    } catch (error){
      console.error("Erro ao verificar estoque: ", error);
      setAlerta(alertaMensagem("Erro ao conectar ao servidor. Tente novamente em instantes.", 'error', <ReportProblemIcon />));
      return;
    }

   
  };

  const gerenciarEstoque = async  () =>{

    try{
      if (!servidorOnline){
        setAlerta(alertaMensagem(mensagemServicosOffline(), 'warning', <ReportProblemIcon />));
        return;
      }

      if(!existeEstoque){
        setAlerta(alertaMensagem('Não existe um estoque criado! Crie um estoque', 'warning', <ReportProblemIcon/>));
        return;
      } 
                
    navigate('/gerenciar-estoque'); 
    fecharModal();
    setAlerta(null)
    setOpen(true)
    
    } catch (error){
      console.error("Erro ao verificar estoque: ", error);
      setAlerta(alertaMensagem("Erro ao conectar ao servidor. Tente novamente em instantes.", 'error', <ReportProblemIcon />));
      return;
    }

  }

  const pedidoCompra = async () =>{

    try{
      if (!servidorOnline){
        setAlerta(alertaMensagem(mensagemServicosOffline(), 'warning', <ReportProblemIcon />));
        return;
      }

      if(!existeEstoque){
        setAlerta(alertaMensagem("É preciso ter um estoque criado! Crie um estoque", 'warning', <ReportProblemIcon />));
        return;
      }   

      navigate('/pedidos-compra'); 
      fecharModal();
      setAlerta(null)
      setOpen(true)

    } catch (error){
      console.error("Erro ao verificar estoque: ", error);
      setAlerta(alertaMensagem("Erro ao conectar ao servidor. Tente novamente em instantes.", 'error', <ReportProblemIcon />));
      return;
    }
  }

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
    <div className="flex justify-center items-center min-h-screen w-screen bg-[#FDEFD6] px-6 py-10">

      {/* Container de conteúdo com largura máxima para não se expandir em telas grandes */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full max-w-4xl">

        {/* Conteúdo: título, descrição e botões — abaixo no mobile, à esquerda no desktop */}
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full md:w-1/2 order-2 md:order-1">
          <h1 className="font-bold text-gray-800 leading-tight">
            <span className="block text-3xl sm:text-4xl md:text-5xl">Bem-vindo,</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl text-orange-500">{dadosUsuario?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-snug max-w-xs">
            Sua plataforma de gestão de estoque de hortifrúti.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={abrirModal} variant="contained" sx={{ backgroundColor: "#FB9E3A", border: "2px solid #fff", borderRadius: "1rem", color: "#fff", px: 3, py: 1, '&:hover': { backgroundColor: "#E6521F" } }}>
              Iniciar
            </Button>
            <Button onClick={sairLogout} variant="contained" sx={{ backgroundColor: "#fb473aff", border: "2px solid #fff", borderRadius: "1rem", color: "#fff", px: 3, py: 1, '&:hover': { backgroundColor: "#c0392b" } }}>
              Sair
            </Button>
          </div>
        </div>

        {/* Imagem — no topo no mobile, à direita no desktop */}
        <div className="flex justify-center items-center w-full md:w-1/2 order-1 md:order-2">
          <img
            src="/logo.png"
            alt="Logo Inicial"
            className="w-52 sm:w-72 md:w-full max-w-sm object-contain"
          />
        </div>

      </div>

      {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301, pointerEvents: 'none' }}>{alerta}</Box>}

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
            width: { xs: '85%', sm: 350 },
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
              onClick={criarEstoque}
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
              onClick={(gerenciarEstoque)}
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
              onClick={() => { pedidoCompra(); }}
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
              <ListItemText primary="Pedidos de compra" />
              </ListItemButton>
            </ListItem>
            </List>
        </Box>
      </Modal>   
    </div>
  )
}

export default PaginalInicial