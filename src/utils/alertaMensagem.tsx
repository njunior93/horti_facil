import Alert from '@mui/material/Alert';

const alertaMensagem = (mensagem: string, tipo: "success" | "error" | "warning", icone: React.ReactElement) =>{
 
    return (     
      <Alert
          icon={icone}
          severity={tipo}
          sx={{ fontSize: '1.2rem', alignItems: 'center' }}
        >
        <span style={{ fontSize: '1.2rem' }}>
          {mensagem}
        </span>
      </Alert>
    )
  }

export default alertaMensagem;