import { Box, Button, FormControl, Menu, MenuItem, Select, TextField } from "@mui/material"
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ListarProdutosVisualizar from './ListaProdutosVisualizar';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import ModalMov from '../utils/modalMov';
import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import alertaMensagem from "../utils/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import axios from "axios";


const VisualizarEstoque = () => {

  const [nomeProduto , setNomeProduto] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [quantidade, setQuantidade] = useState(0)
  const setTipoModal = useContext(AppContext).setTipoModal;
  const setTipoEntrada = useContext(AppContext).setTipoEntrada;
  const setTipoSaida = useContext(AppContext).setTipoSaida;
  const {handleModal, setHandleModal} = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState<React.ReactNode | null>(null);
  const {setEstoqueSalvo} = useContext(AppContext);
  const {estoqueId,setEstoqueId} = useContext(AppContext);
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);

  
  setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);

  useEffect(() => {
    const fetchListaProdutos = async () => {

      setLoading(true);

      const {data : {session}} = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token){
        setLoading(false);
        setMensagemErro(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
        navigate("/pagina-login")
        return;
      }

      try{
        const response = await axios.get('http://localhost:3000/estoque/lista-produtos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setEstoqueSalvo(response.data);

      } catch (error){
        setMensagemErro(alertaMensagem(`Erro ao buscar lista de produtos. ${error}`, 'warning', <ReportProblemIcon/>));
      } finally {
        setLoading(false);
      }
    };

    fetchListaProdutos();
  }, []);

  useEffect(() => {
  if (handleModal === true) {
    if (!estoqueId){
      setAlerta(alertaMensagem('Erro na consulta do estoque.', 'error', <ReportProblemIcon/>));
      setHandleModal(false);
    }
  }
}, [handleModal]);

  const navigate = useNavigate();
  
  const opcoesMenu: string[] = ["Posição de estoque", "Movimentação de estoque"];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const handleAbrirModalEntrada = () => {
    setHandleModal(true);
    setTipoModal("Entrada");
    setTipoEntrada('Manual');
    setTipoSaida('');
  };

  const handleAbrirModalSaida = () =>{
    setHandleModal(true);
    setTipoModal("Saída");
    setTipoEntrada('');
  }

  const sairGerenciarEstoque = () => {
    setHandleModal(false);
    setTipoModal('');
    setTipoEntrada('');
    setTipoSaida('');
    navigate('/pagina-inicial');
  }

  const handleAbrirModalMovimentacao = (opcao: string) => {
    if (opcao === "Posição de estoque") {
      setHandleModal(true);
      setTipoModal("PosicaoEstoque");
      return;
    } else if (opcao === "Movimentação de estoque") {
      setHandleModal(true);
      setTipoModal("MovimentacaoEstoque");
      return;
    }
  }

  return (

    <div className="flex flex-col size-fit bg-[#FCEED5] p-4 rounded-lg shadow-lg">
      
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant='contained'
        >
            RELATORIO
        </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
              },
            }}
          >
            {opcoesMenu.map((opcao, idx) => (
                <MenuItem key={idx} onClick={() => handleAbrirModalMovimentacao(opcao)}>{opcao}</MenuItem>
            ))}
          </Menu>
      </div>

      <div className='flex sm:flex-row  w-full h-3/5 justify-around items-center p-4 gap-2'>
        <FormControl>
        <h1 className="text-lg font-semibold mb-2 text-gray-700">Filtros:</h1>
        <div className="flex flex-col gap-4 w-full">       
          <Select label="Todos" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="horta">Hortaliças</MenuItem>
            <MenuItem value="fruta">Frutas</MenuItem>
          </Select>
          <TextField label="Produto" variant="outlined" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)}></TextField>
          <TextField label="Quantidade" variant="standard" type="number" size="small" sx={{width: 90}} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}></TextField>
        </div>  
        </FormControl>


        <div className="flex flex-col gap-3 justify-center h-2/5 w-2/5 border-1 border-gray-500/50 sm:p-5">
          <Button  variant="contained" startIcon={<ArchiveOutlinedIcon />} sx={{ boxSizing: 'border-box', backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "black", '&:hover': { backgroundColor: "#6FE6FC",},}} onClick={() => handleAbrirModalEntrada()}>Entrada</Button>
          <Button  variant="contained" startIcon={<UnarchiveOutlinedIcon />} sx={{ boxSizing: 'border-box', backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "black", '&:hover': { backgroundColor: "#6FE6FC",},}} onClick={() => handleAbrirModalSaida()}>Saida</Button>
          <Button  variant="contained" startIcon={<LogoutOutlinedIcon />} sx={{ boxSizing: 'border-box', backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "black", '&:hover': { backgroundColor: "#6FE6FC",},}} onClick={() => sairGerenciarEstoque()}>Voltar</Button>
        </div>
      </div>

      <ModalMov />

      <ListarProdutosVisualizar nome={nomeProduto} tipo={tipo} qtd={quantidade}/>

    {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
     
    </div>
      
  )
}

export default VisualizarEstoque