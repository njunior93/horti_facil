import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';

const alertaMensagem = (mensagem: string, tipo: "success" | "error" | "warning", icone: React.ReactElement) =>{
 
    return (     
      <Alert
          icon={icone}
          severity={tipo}
          sx={{ fontSize: { xs: '0.9rem', sm: '1.2rem' } }}
        >
        <Box component="span" sx={{ fontSize: { xs: '0.9rem', sm: '1.2rem' } }}>
          {mensagem}
        </Box>
      </Alert>
    )
  }

export default alertaMensagem;