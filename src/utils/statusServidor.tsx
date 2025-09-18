import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { StatusServidorContext } from "../context/StatusServidorProvider";
import { useContext } from "react";
import { AppContext } from "../context/context";
import { useNavigate } from "react-router-dom";


export const StatusServidor = () => {
  const navigate = useNavigate();
  const {setListaProdutoEstoque} = useContext(AppContext);
  const {setContQtdEstoque} = useContext(AppContext);
  const{setTipoInput} = useContext(AppContext);
  const context = useContext(StatusServidorContext)

  const telaCriarEstoque = location.pathname === '/criar-estoque'

  if (!context) {
    throw new Error("StatusServidor deve ser usado dentro de StatusServidorProvider");
  }

  const { servidorOnline, sessaoAtiva } = context;

  const sair = () =>{
    setListaProdutoEstoque([]);
    setContQtdEstoque(0);
    navigate("/pagina-inicial")
    setTipoInput("auto");
  }

  return (
    <Backdrop sx={{ color: '#f5880bff', zIndex: (theme) => theme.zIndex.drawer + 1 }}open={!servidorOnline || !sessaoAtiva}>

        {telaCriarEstoque  && !servidorOnline ? (
        <>
          <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#FDEFD6] text-center px-4">
            <p className="text-2xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg leading-snug mb-6">
              Servidor fora do ar
            </p>

            <p className="text-sm md:text-lg text-gray-700 mb-8 max-w-xl">
              Conexão com o servidor está temporariamente indisponível. Por favor, saia da página e tente novamente em alguns instantes.
            </p>
            
              <button onClick={sair}className="px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-white font-bold shadow-lg hover:scale-105 transition-transform">Voltar</button>
          </div>
        </>
      ) : (
        <>
            <CircularProgress color="inherit" />
            <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', md: '1.75rem' }, // Equ
              fontWeight: 'extrabold', 
              color: '#fff', 
              WebkitBackgroundClip: 'text', 
              backgroundClip: 'text', 
              textShadow: '2px 2px 4px rgba(150, 148, 148, 1)', 
              ml: 2,  }}>
                Estabelecendo conexão... Por favor, aguarde.
            </Typography>
          </>
      )}     
    </Backdrop>
  )
}

