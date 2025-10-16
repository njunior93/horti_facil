import { Paper, CircularProgress,Box,Typography, Tooltip } from "@mui/material";
import { StatusServidorContext } from "../context/StatusServidorProvider";
import { useContext } from "react";
import { AppContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { WifiOff, CloudOff, CloudDone, Wifi } from "@mui/icons-material";



export const StatusServidor = () => {
  const navigate = useNavigate();
  const {setListaProdutoEstoque} = useContext(AppContext);
  const {setContQtdEstoque} = useContext(AppContext);
  const{setTipoInput} = useContext(AppContext);
  const context = useContext(StatusServidorContext)

  const telaPrincipal = location.pathname === "/pagina-inicial"

  if (!context) {
    throw new Error("StatusServidor deve ser usado dentro de StatusServidorProvider");
  }

  const { servidorOnline, sessaoAtiva, conexaoInternet } = context;

  const getStatus = () =>{
    if (!conexaoInternet){
      return {
        cor: "#f44336",
        texto: "Sem conexão com a Internet",
        icone: <WifiOff fontSize="small" />, 
      }
    }

    if (!servidorOnline){
      return {
        cor: "#f44336",
        texto: "Sem conexão com o servidor",
        icone: <CloudOff fontSize="small" />,
      }

      return {
        cor: "#4caf50",
        texto: "Conectado",
        icone: <CloudDone fontSize="small" />,
      }
    }
  }

  const status = getStatus();

  const sair = () =>{
    setListaProdutoEstoque([]);
    setContQtdEstoque(0);
    navigate("/pagina-inicial")
    setTipoInput("auto");
  }

  const recarregarPagina = () =>{
    window.location.reload();
  }

  return (
    // <Backdrop sx={{ color: '#f5880bff', zIndex: (theme) => theme.zIndex.drawer + 1 }}open={!conexaoInternet || !servidorOnline}>

    //     {telaPrincipal && !conexaoInternet ? (
    //       <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#FDEFD6] text-center px-4">
    //         <p className="text-2xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug mb-6">
    //           Sem conexão com a internet
    //         </p>

    //         <p className="text-sm md:text-lg text-gray-700 mb-8 max-w-xl">
    //           Verifique sua rede e recarregue sua página.
    //         </p>
            
    //           <button onClick={() => recarregarPagina()}className="px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-white font-bold shadow-lg hover:scale-105 transition-transform">Recarregar</button>
    //       </div>
    //   ) : conexaoInternet && !servidorOnline ? (
    //     <>
    //         <CircularProgress color="inherit" />
    //         <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', md: '1.75rem' }, // Equ
    //           fontWeight: 'extrabold', 
    //           color: '#fff', 
    //           WebkitBackgroundClip: 'text', 
    //           backgroundClip: 'text', 
    //           textShadow: '2px 2px 4px rgba(150, 148, 148, 1)', 
    //           ml: 2,  }}>
    //             Estabelecendo conexão com o servidor... Por favor, aguarde.
    //         </Typography>
    //     </>
    //   ) : null}

    //   {!telaPrincipal && !conexaoInternet ? (
    //        <>
    //         <CircularProgress color="inherit" />
    //         <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', md: '1.75rem' }, // Equ
    //           fontWeight: 'extrabold', 
    //           color: '#fff', 
    //           WebkitBackgroundClip: 'text', 
    //           backgroundClip: 'text', 
    //           textShadow: '2px 2px 4px rgba(150, 148, 148, 1)', 
    //           ml: 2,  }}>
    //             Sem conexão com a internet. Verifique sua rede.
    //         </Typography>
    //     </>
    //   ) : null}

    // </Backdrop>

    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderRadius: 2,
        color: "#fff",
        zIndex: 2000,
        transition: "all 0.3s ease",
      }}>
        <Typography variant="body2" sx={{ color: "#000000ff", fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }}}>Status do Sistema</Typography>
        
        <Box display="flex" alignItems="center" gap={1}>
          {conexaoInternet ? (
          <Wifi sx={{ color: "#4caf50" }} fontSize="small" />
        ) : (
          <WifiOff sx={{ color: "#f44336" }} fontSize="small" />
        )}

        <Tooltip title="Conexão com a Internet" arrow>
          <Typography variant="body2" sx={{ fontWeight: 600, color: conexaoInternet ? "#4caf50" : "#f44336"}}>{conexaoInternet ? "Online" : "Sem conexão"}</Typography>
        </Tooltip>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {servidorOnline ? (
          <CloudDone sx={{ color: "#4caf50" }} fontSize="small" />
        ) : (
          <CloudOff sx={{ color: "#f44336" }} fontSize="small" />
        )}

        <Tooltip title="Status do servidor" arrow>
          <Typography variant="body2" sx={{ fontWeight: 600, color: servidorOnline ? "#4caf50" : "#f44336"}}>{servidorOnline ? "Online" : "Sem conexão"}</Typography>
        </Tooltip>
        </Box>
    </Paper>

  )
}

