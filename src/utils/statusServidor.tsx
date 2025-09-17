import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { StatusServidorContext } from "../context/StatusServidorProvider";
import { useContext } from "react";


export const StatusServidor = () => {
  const context = useContext(StatusServidorContext)

  if (!context) {
    throw new Error("StatusServidor deve ser usado dentro de StatusServidorProvider");
  }

  const { servidorOnline, sessaoAtiva } = context;

  return (
    <Backdrop
      sx={{ color: '#f5880bff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={!servidorOnline || !sessaoAtiva}
    >
      {!servidorOnline && (
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

      {!sessaoAtiva && (
        <>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', md: '1.75rem' }, // Equ
            fontWeight: 'extrabold', 
            color: '#fff', 
            WebkitBackgroundClip: 'text', 
            backgroundClip: 'text', 
            textShadow: '2px 2px 4px rgba(150, 148, 148, 1)', 
            ml: 2,  }}>
            Sua sessão expirou. Por favor, saia do sistema e faça login novamente.
          </Typography>
        </>
      )}
    </Backdrop>
  )
}

