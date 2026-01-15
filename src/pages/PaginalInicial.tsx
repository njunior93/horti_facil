import { Button } from "@mui/material"
import { useState } from "react";
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
  // const verificarInternet = StatusServidorContext?.conexaoInternet;
  const verificarServidor = StatusServidorContext?.servidorOnline;

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

  // const verificarEstoque = async () =>{

  //   const { data: { session } } = await supabase.auth.getSession();
  //   const token = session?.access_token;

  //   if (!session){
  //     setAlerta(alertaMensagem('Faça login para gerenciar seu estoque.', 'warning', <ReportProblemIcon/>));
  //     navigate("/")
  //     return false;
  //   }

  //   if (!token){
  //     setAlerta(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
  //     navigate("/")
  //     return false;
  //   }

  //   try {
  //   const response = await axios.get('http://localhost:3000/estoque/verificar-estoque', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   return response.data.existe;

  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response){
  //       setAlerta(alertaMensagem(`Erro: ${error.response.data.message}`, 'warning', <ReportProblemIcon/>));          
  //     } else {
  //       setAlerta(alertaMensagem(`Não foi possível verificar o estoque. ${error}`, 'warning', <ReportProblemIcon/>));
  //     }
  //     throw error;
  //   }
  // }

  const criarEstoque = async () =>{

    try{

      if (!verificarServidor){
        setAlerta(alertaMensagem("Conexão com servidor perdida. Tente novamente em instantes", 'error', <ReportProblemIcon />));
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
      if (!verificarServidor){
        setAlerta(alertaMensagem("Conexão com servidor perdida. Tente novamente em instantes", 'error', <ReportProblemIcon />));
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
      if (!verificarServidor){
        setAlerta(alertaMensagem("Conexão com servidor perdida. Tente novamente em instantes", 'error', <ReportProblemIcon />));
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
              disabled={existeEstoque === null}
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
              disabled={existeEstoque === null}
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
              disabled={existeEstoque === null}
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