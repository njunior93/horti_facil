import { Paper, Box,Typography, Tooltip } from "@mui/material";
import { StatusServidorContext } from "../../providers/StatusServidorProvider";
import { useContext } from "react";
// import { AppContext } from "../context/context";
// import { useNavigate } from "react-router-dom";
import { WifiOff, CloudOff, CloudDone, Wifi } from "@mui/icons-material";



export const StatusServidor = () => {
  const context = useContext(StatusServidorContext)

  if (!context) {
    throw new Error("StatusServidor deve ser usado dentro de StatusServidorProvider");
  }

  const { servidorOnline, conexaoInternet } = context;

  return (

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

