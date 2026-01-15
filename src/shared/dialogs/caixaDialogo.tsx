import { useContext } from 'react';
import {Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/context';

interface CaixaDialogoProps {
  titulo: string;
  texto: string;
  botão: string
}

export default function CaixaDialogo(props: CaixaDialogoProps) {

const navigate = useNavigate();
const {mostrarCaixaDialogo, setMostrarCaixaDialogo} = useContext(AppContext);



  const handleGerenciarEstoque = () => {
    navigate('/gerenciar-estoque');
    setMostrarCaixaDialogo(false);
  }

  const handleSair = () => {
    navigate("/pagina-inicial")
    setMostrarCaixaDialogo(false);
  };


  return (
    <div>
      <Dialog open={mostrarCaixaDialogo} onClose={(_event: object,reason) => reason != 'backdropClick' && setMostrarCaixaDialogo(false)} PaperProps={{ sx: { borderRadius: '16px',padding: 3,minWidth: 300, maxWidth: 400,boxShadow: 10}}}>
        <DialogTitle>{props.titulo}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.texto}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          justifyContent: 'center',
          gap: 2,
          paddingBottom: 2
        }}
      >
          <Button onClick={handleGerenciarEstoque}
          fullWidth
           sx={{
                backgroundColor: "#FDEFD6",
                fontSize:  "1rem",
                padding: { xs: "6px 12px", sm: "8px 16px" },
                borderRadius: "0.75rem",
                color: "#000",
                textTransform: "capitalize",
                mb: 1,
                transition: "background 0.2s",
                '&:hover': {
                backgroundColor: "#FB9E3A",
                color: "#fff",
                },
              }}
          
          
          >{props.botão}</Button>
          <Button onClick={handleSair}
          sx={{
                backgroundColor: "#FDEFD6",
                borderRadius: "0.75rem",
                color: "#000",
                textTransform: "capitalize",
                fontSize: "1rem",
                padding: { xs: "6px 12px", sm: "8px 16px" },
                mb: 1,
                transition: "background 0.2s",
                '&:hover': {
                backgroundColor: "#FB9E3A",
                color: "#fff",
                },
              }}>Sair</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}