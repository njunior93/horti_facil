import { Button, FormControl, Menu, MenuItem, Select, TextField } from "@mui/material"
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ListarProdutosVisualizar from './ListaProdutosVisualizar';
import { useContext, useState } from "react";
import { AppContext } from "../context/context";
// import { Modal, Box, Typography } from "@mui/material";
// import ListaEntradaManual from "./ListaEntradaManual";
// import type { iProduto } from "../type/iProduto";
// import alertaMensagem from "../utils/alertaMensagem";
import ModalMov from '../utils/modalMov';
import React from "react";
import { useNavigate } from "react-router-dom";


const VisualizarEstoque = () => {

  const [nomeProduto , setNomeProduto] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [quantidade, setQuantidade] = useState(0)
  // const [modalAberto, setModalAberto] = useState(false);
  // const {estoqueSalvo, setEstoqueSalvo} = useContext(AppContext);
  // const [produtoSelecionado, setProdutoSelecionado] = useState<iProduto>({} as iProduto)
  // const [valorEntrada, setValorEntrada] = useState<number>(0)
  // const {listaProdutoEntrada, setListaProdutoEntrada} = useContext(AppContext);
  // const [alertaAddProduto, setAlertaAddProduto] = useState<React.ReactNode | null>(null);
  const setTipoModal = useContext(AppContext).setTipoModal;
  const {tipoEntrada, setTipoEntrada} = useContext(AppContext);
  const {tipoSaida, setTipoSaida} = useContext(AppContext);
  const setHandleModal = useContext(AppContext).setHandleModal;

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

  // setTimeout(() =>{
  //   if(alertaAddProduto){
  //     setAlertaAddProduto(null)
  //   }
  // },4000);

  // const atualizaEstoqueEntrada = () =>{
  //   const estoqueAtualizado = estoqueSalvo.listaProdutos.map((produtoEstoque) =>{
  //     const entrada = listaProdutoEntrada.find(
  //       (entrada) => entrada.produto.id === produtoEstoque.id
  //     );

  //     if (entrada){
  //       return { ...produtoEstoque, estoque: (produtoEstoque.estoque ?? 0) + entrada.qtdMov }
  //     };  
  //       return produtoEstoque;    
  //   });
  //   setEstoqueSalvo({ ...estoqueSalvo, listaProdutos: estoqueAtualizado })
  //   setModalAberto(false)
  //   setProdutoSelecionado({} as iProduto)
  //   setValorEntrada(0)
  //   setListaProdutoEntrada([]);
  // }

  // const cancelaEstoqueEntrada = () =>{
  //   setHandleModal(false);
  //   setTipoModal('')
  //   setProdutoSelecionado({} as iProduto)
  //   setValorEntrada(0)
  //   setListaProdutoEntrada([]);
  // }

  // const selecaoProduto = (e: SelectChangeEvent) => {
  //   const produto = estoqueSalvo.listaProdutos.find(
  //     (p: iProduto) => p.id === Number(e.target.value));

  //   if (produto) {
  //     setProdutoSelecionado(produto);
  //   }
  //   setValorEntrada(0);
  // }
  

  // const addProdutoEntrada = (produto: iProduto, qtdMov: number) => {
  //   const produtoExiste = listaProdutoEntrada.some(item => item.produto.id === produto.id);

  //   if (produtoExiste) {
  //     setAlertaAddProduto(alertaMensagem("Produto ja adicionado!", "warning", <ReportProblemIcon/>));
  //     return;
  //   }

  //   if (!qtdMov  ||  qtdMov <= 0 || isNaN(qtdMov)){
  //     setAlertaAddProduto(alertaMensagem("Valor incorreto", "warning", <ReportProblemIcon/>));
  //     return;
  //   }

  //   setListaProdutoEntrada([...listaProdutoEntrada, { produto, qtdMov }]);
  //   setValorEntrada(0)
  //   setAlertaAddProduto(null)
  // }

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
    navigate('/');
  }

  const handleAbrirModalMovimentacao = (opcao: string) => {
    if (opcao === "Posição de estoque") {
      setHandleModal(true);
      setTipoModal("PosicaoEstoque");
      console.log(opcao)
      return;
    } else if (opcao === "Movimentação de estoque") {
      setHandleModal(true);
      setTipoModal("MovimentacaoEstoque");
      console.log(opcao)
      return;
    }
  }

  return (

    <div className="flex flex-col w-1/2 h-4/5 bg-[#FCEED5] p-4 rounded-lg shadow-lg">
      
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

      <div className='flex flex-row  w-full h-3/5 justify-around items-center p-4 gap-2'>
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


        <div className="flex flex-col gap-3 justify-center h-2/5 w-2/5 border-1 border-gray-500/50 p-5">
          <Button  variant="contained" startIcon={<ArchiveOutlinedIcon />} sx={{ boxSizing: 'border-box', backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "black", '&:hover': { backgroundColor: "#6FE6FC",},}} onClick={() => handleAbrirModalEntrada()}>Entrada</Button>
          <Button  variant="contained" startIcon={<UnarchiveOutlinedIcon />} sx={{ boxSizing: 'border-box', backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "black", '&:hover': { backgroundColor: "#6FE6FC",},}} onClick={() => handleAbrirModalSaida()}>Saida</Button>
          <Button  variant="contained" startIcon={<LogoutOutlinedIcon />} sx={{ boxSizing: 'border-box', backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "black", '&:hover': { backgroundColor: "#6FE6FC",},}} onClick={() => sairGerenciarEstoque()}>Voltar</Button>
        </div>
      </div>

      {/* <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        aria-labelledby="modal-estoque-title"
        aria-describedby="modal-estoque-description"
      >
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-estoque-title" variant="h6" component="h2" gutterBottom>
            Entrada Manual no estoque
          </Typography>
          
          <div className="flex flex-col gap-3">
            <Select
              value={produtoSelecionado.id ? String(produtoSelecionado.id) : ""}
              onChange={selecaoProduto}
              displayEmpty
              label="Produto"
            >
              <MenuItem value="" disabled>
                Selecione o produto
              </MenuItem>
              {estoqueSalvo.listaProdutos && estoqueSalvo.listaProdutos.length > 0 ? (
                estoqueSalvo.listaProdutos.map((produto: iProduto) => (
                  <MenuItem key={produto.id} value={String(produto.id)}>
                    {produto.nome}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Nenhum produto disponível
                </MenuItem>
              )}
            </Select>
            <TextField disabled={true} value={produtoSelecionado.estoque ?? ""} label="Estoque Atual"></TextField>

            <div className="flex flex-row items-center gap-4">
              <TextField  value={valorEntrada} onChange={(e) => setValorEntrada(Number(e.target.value))} disabled={!produtoSelecionado.id} label="Entrada Manual"></TextField>
              <Button onClick={() => { addProdutoEntrada(produtoSelecionado, valorEntrada);}} sx={{ backgroundColor: "#4CAF50", color: "#fff", '&:hover': { backgroundColor: "#388E3C" } }} disabled={!produtoSelecionado.id}> <span className="text-xl">+</span></Button>
            </div> 
            {alertaAddProduto && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alertaAddProduto}</Box>}     
          </div>

          <ListaEntradaManual /> 
          
          <div className="flex flex-row gap-2">
            <Button  variant="contained" onClick={cancelaEstoqueEntrada} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }}>Cancelar</Button>
            <Button variant="contained" onClick={atualizaEstoqueEntrada} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }} disabled={listaProdutoEntrada.length === 0}>Confirmar</Button>
          </div>
          
        </Box>
      </Modal> */}

      <ModalMov />

      <ListarProdutosVisualizar nome={nomeProduto} tipo={tipo} qtd={quantidade}/>

     
    </div>   
  )
}

export default VisualizarEstoque