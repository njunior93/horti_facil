import { Paper, Box, Typography, Tooltip, CircularProgress } from "@mui/material";
import { StatusServidorContext } from "../../providers/StatusServidorProvider";
import { useContext } from "react";
import { WifiOff, CloudOff, CloudDone, Wifi } from "@mui/icons-material";

type StatusIndicadorProps = {
  status: boolean | null;
  tooltipOnline: string;
  tooltipOffline: string;
  tooltipVerificando: string;
  labelOnline: string;
  labelOffline: string;
  iconeOnline: React.ReactNode;
  iconeOffline: React.ReactNode;
};

const StatusIndicador = ({
  status,
  tooltipOnline,
  tooltipOffline,
  tooltipVerificando,
  labelOnline,
  labelOffline,
  iconeOnline,
  iconeOffline,
}: StatusIndicadorProps) => {
  if (status === null) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <CircularProgress size={16} thickness={5} sx={{ color: "#9e9e9e" }} />
        <Tooltip title={tooltipVerificando} arrow>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#9e9e9e", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
            Verificando...
          </Typography>
        </Tooltip>
      </Box>
    );
  }

  if (status) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        {iconeOnline}
        <Tooltip title={tooltipOnline} arrow>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#4caf50", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
            {labelOnline}
          </Typography>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
        <CircularProgress size={20} thickness={5} sx={{ color: "#f44336" }} />
        {iconeOffline}
      </Box>
      <Tooltip title={tooltipOffline} arrow>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#f44336", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
          {labelOffline}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export const StatusServidor = () => {
  const context = useContext(StatusServidorContext);

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
        gap: 1.5,
        borderRadius: 2,
        zIndex: 2000,
        transition: "all 0.3s ease",
      }}
    >
      <Typography variant="body2" sx={{ color: "#000000ff", fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
        Status do Sistema
      </Typography>

      {/* Conexão com a internet */}
      <StatusIndicador
        status={conexaoInternet}
        tooltipOnline="Conexão com a Internet ativa"
        tooltipOffline="Sem conexão com a Internet"
        tooltipVerificando="Verificando conexão com a Internet..."
        labelOnline="Internet"
        labelOffline="Sem rede"
        iconeOnline={<Wifi sx={{ color: "#4caf50" }} fontSize="small" />}
        iconeOffline={<WifiOff sx={{ color: "#f44336", position: "absolute", fontSize: 12 }} />}
      />

      {/* Separador */}
      <Box sx={{ width: "1px", height: 16, backgroundColor: "#ccc" }} />

      {/* Servidor (backend + Supabase unificados) */}
      <StatusIndicador
        status={servidorOnline}
        tooltipOnline="Servidor e banco de dados disponíveis"
        tooltipOffline="Servidor ou banco de dados indisponível"
        tooltipVerificando="Verificando servidor e banco de dados..."
        labelOnline="Servidor"
        labelOffline="Servidor offline"
        iconeOnline={<CloudDone sx={{ color: "#4caf50" }} fontSize="small" />}
        iconeOffline={<CloudOff sx={{ color: "#f44336", position: "absolute", fontSize: 12 }} />}
      />
    </Paper>
  );
};
