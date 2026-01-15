import { Box, Button, FormControl, Menu, MenuItem, Select, TextField } from "@mui/material"
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ListarProdutosVisualizar from '../../../shared/components/ListaProdutosVisualizar';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../shared/context/context";
import ModalMov from '../../../shared/modals/modalMov';
import React from "react";
import { useNavigate } from "react-router-dom";
import alertaMensagem from "../../../shared/components/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const VisualizarEstoque = () => {

  const [nomeProduto , setNomeProduto] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [quantidade, setQuantidade] = useState(0)
  const setTipoModal = useContext(AppContext).setTipoModal;
  const setTipoEntrada = useContext(AppContext).setTipoEntrada;
  const setTipoSaida = useContext(AppContext).setTipoSaida;
  const {handleModal, setHandleModal} = useContext(AppContext);
  const {estoqueId} = useContext(AppContext);
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);

  
  setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);

  // useEffect(() => {
  //   const fetchListaProdutos = async () => {

  //     setLoading(true);

  //     const {data : {session}} = await supabase.auth.getSession();
  //     const token = session?.access_token;

  //     if (!token){
  //       setLoading(false);
  //       setMensagemErro(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
  //       navigate("/pagina-login")
  //       return;
  //     }

  //     try{
  //       const response = await axios.get('http://localhost:3000/estoque/lista-produtos', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });

  //       setEstoqueSalvo(response.data);

  //     } catch (error){
  //       setMensagemErro(alertaMensagem(`Erro ao buscar lista de produtos. ${error}`, 'warning', <ReportProblemIcon/>));
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchListaProdutos();
  // }, []);

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

    <div className="flex flex-col w-full min-w-0 gap-4"> 
      <div>
        <Button  id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}  onClick={handleClick} variant='contained' > Relatorios </Button>
          <Menu id="basic-menu"  anchorEl={anchorEl} open={open} onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
              },
            }}>
            {opcoesMenu.map((opcao, idx) => (
                <MenuItem key={idx} onClick={() => handleAbrirModalMovimentacao(opcao)}>{opcao}</MenuItem>
            ))}
          </Menu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7">
          <FormControl className="w-full">
            <h2 className="text-base font-semibold mb-2 text-gray-700">Filtros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={tipo} onChange={(e) => setTipo(e.target.value)} displayEmpty fullWidth>
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="horta">Hortaliças</MenuItem>
                <MenuItem value="fruta">Frutas</MenuItem>
              </Select>

          <TextField label="Produto" variant="outlined" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} fullWidth/>
          <TextField  label="Quantidade" variant="outlined" type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} fullWidth/>
      </div>
    </FormControl>
  </div>

  <div className="lg:col-span-5">
    <div className="rounded-2xl border border-gray-400/30 bg-white/40 p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button fullWidth variant="contained" startIcon={<ArchiveOutlinedIcon />}
          sx={{
            padding: '10px',
            fontSize: '11px',
            backgroundColor: "#f7931e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            "&:hover": { backgroundColor: "#e67e00" },
          }}
          onClick={handleAbrirModalEntrada}
        >
          Entrada
        </Button>

        <Button fullWidth variant="contained" startIcon={<UnarchiveOutlinedIcon />}
          sx={{
            padding: '10px',
            fontSize: '11px',
            backgroundColor: "#f7931e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            "&:hover": { backgroundColor: "#e67e00" },
          }}
          onClick={handleAbrirModalSaida}
        >
          Saída
        </Button>

        <Button fullWidth  variant="contained" startIcon={<LogoutOutlinedIcon />}
          sx={{
            padding: '10px',
            fontSize: '11px',
            backgroundColor: "#f7931e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            "&:hover": { backgroundColor: "#e67e00" },
          }}
          onClick={sairGerenciarEstoque}
        >
          Voltar
        </Button>
      </div>
    </div>
  </div>
</div>


      <ModalMov/>

      <ListarProdutosVisualizar nome={nomeProduto} tipo={tipo} qtd={quantidade}/>

    {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
     
    </div>
      
  )
}

export default VisualizarEstoque