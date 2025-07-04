import React from 'react'
import { Box, Button, FormControlLabel, FormLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography, type SelectChangeEvent } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import ListaMovManual from "../componentes/ListaMovManual";
import type { iProduto } from "../type/iProduto";
import alertaMensagem from "./alertaMensagem";
import type { iProdutoMov } from '../type/iProdutoMov';

const ModalMov = () => {

    const {handleModal, setHandleModal} = useContext(AppContext);
    const {tipoModal, setTipoModal} = useContext(AppContext);
    const {estoqueSalvo, setEstoqueSalvo} = useContext(AppContext);
    const [produtoSelecionado, setProdutoSelecionado] = useState<iProduto>({} as iProduto)
    const [valorMov, setValorMov] = useState<number>(0)
    const {listaProdutoMov, setListaProdutoMov} = useContext(AppContext);
    const [alertaAddProduto, setAlertaAddProduto] = useState<React.ReactNode | null>(null);
    const [tipoSaida, setTipoSaida] = useState('');
    const {listaHistoricoMovEstoque, setListaHistoricoMovEstoque } = useContext(AppContext);

  setTimeout(() =>{
    if(alertaAddProduto){
      setAlertaAddProduto(null)
    }
  },4000);


  const cancelarEstoque = () =>{
    setHandleModal(false)
    setTipoModal("");
    setProdutoSelecionado({} as iProduto)
    setValorMov(0)
    setListaProdutoMov([]);
    setTipoSaida('Venda')
  }

  const selecaoProduto = (e: SelectChangeEvent) => {
    const produto = estoqueSalvo.listaProdutos.find(
      (p: iProduto) => p.id === Number(e.target.value));
  
    if (produto) {
      setProdutoSelecionado(produto);
    }
    setValorMov(0);
    setTipoSaida('');
  }

  const addProdutoLista = (produto: iProduto, qtdMov: number, tipoSaida: string, tipoMov: string, dataMov: Date) => {
    const produtoExiste = listaProdutoMov.some(item => item.produto.id === produto.id);
  
    if (produtoExiste) {
      setAlertaAddProduto(alertaMensagem("Produto ja adicionado!", "warning", <ReportProblemIcon/>));
      return;
    }
  
    if (tipoModal === "Entrada" && !qtdMov  ||  qtdMov <= 0 || isNaN(qtdMov)){
      setAlertaAddProduto(alertaMensagem("Valor incorreto", "warning", <ReportProblemIcon/>));
      return;
    }

    if (tipoModal === 'Saida' && !qtdMov || isNaN(qtdMov) || tipoModal === 'Saida' && qtdMov > (produto.estoque ?? 0)){
      setAlertaAddProduto(alertaMensagem("Valor incorreto", "warning", <ReportProblemIcon/>));
      return;
    }

    if( tipoModal === 'Saida' && !tipoSaida){
      setAlertaAddProduto(alertaMensagem("Selecione o tipo de saida", "warning", <ReportProblemIcon/>));
      return;
    }
  
    setListaProdutoMov([...listaProdutoMov, { produto, qtdMov, tipoSaida, tipoMov , dataMov}]);
    setValorMov(0)
    setAlertaAddProduto(null)
    setTipoSaida('');
  }

  const atualizarEstoque = () =>{

    const historicoTemp: iProdutoMov[] = [];

    const estoqueAtualizado = estoqueSalvo.listaProdutos.map((produtoEstoque) =>{
      const entrada = listaProdutoMov.find(
        (mov) => mov.produto.id === produtoEstoque.id
      );     
  
      if (entrada && tipoModal === 'Entrada'){
        const novoEstoque = (produtoEstoque.estoque ?? 0) + entrada.qtdMov;
        if(novoEstoque !== produtoEstoque.estoque){
          historicoTemp.push(entrada)
        }   
        return { ...produtoEstoque, estoque: novoEstoque, estoqueSuficiente: novoEstoque >= (produtoEstoque.estoqueMinimo ?? 0) ? true : false }
      }
      
      if (entrada && tipoModal === 'Saida'){
        const novoEstoque = (produtoEstoque.estoque ?? 0) - entrada.qtdMov;
        if(novoEstoque !== produtoEstoque.estoque){
          historicoTemp.push(entrada)
        } 
         return { ...produtoEstoque, estoque: novoEstoque, estoqueSuficiente: novoEstoque >= (produtoEstoque.estoqueMinimo ?? 0) ? true : false }
      } 

        return produtoEstoque;
        
  });

  setEstoqueSalvo({ ...estoqueSalvo, listaProdutos: estoqueAtualizado })

    if (historicoTemp.length > 0 && setListaHistoricoMovEstoque && listaHistoricoMovEstoque) {
      setListaHistoricoMovEstoque([...listaHistoricoMovEstoque, ...historicoTemp]);
    }

    setHandleModal(false)
    setTipoModal('')
    setProdutoSelecionado({} as iProduto)
    setValorMov(0)
    setListaProdutoMov([]);
    setTipoSaida('')
  }

  const selecaoTipoSaida = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setTipoSaida((e.target as HTMLInputElement).value);   
  }

  return (

    <div>
      <Modal
        open={handleModal}
        onClose={() => setHandleModal(false)}
        aria-labelledby="modal-estoque-title"
        aria-describedby="modal-estoque-description"
      >
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-estoque-title" variant="h6" component="h2" gutterBottom>
            {tipoModal === 'Entrada' ? 'Entrada Manual no estoque' : tipoModal === 'Saida' ? 'Saida Manual do estoque' : ''}
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
              <TextField  value={valorMov} onChange={(e) => setValorMov(Number(e.target.value))} disabled={!produtoSelecionado.id} label={tipoModal === 'Entrada' ? 'Entrada Manual' : tipoModal === 'Saida' ? 'Saida Manual' : ''}></TextField>
              <Button onClick={() => { addProdutoLista(produtoSelecionado, valorMov, tipoSaida, tipoModal, new Date());}} sx={{ backgroundColor: "#4CAF50", color: "#fff", '&:hover': { backgroundColor: "#388E3C" } }} disabled={!produtoSelecionado.id}> <span className="text-xl">+</span></Button>
            </div> 
            {alertaAddProduto && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alertaAddProduto}</Box>}     
          
              {tipoModal === 'Saida' && 
              (
                <>
                  <FormLabel id="demo-controlled-radio-buttons-group">Tipo de saida</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    row
                    name="controlled-radio-buttons-group"
                    value={tipoSaida}
                    onChange={selecaoTipoSaida}
                    >
                    <FormControlLabel disabled={!valorMov} value="Venda" control={<Radio />} label="Venda" />
                    <FormControlLabel disabled={!valorMov} value="Avaria" control={<Radio />} label="Avaria" />
                  </RadioGroup>  
                </>
              )}       
          </div>

          <ListaMovManual /> 
          
          <div className="flex flex-row gap-2">
            <Button  variant="contained" onClick={cancelarEstoque} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }}>Cancelar</Button>
            <Button variant="contained" onClick={atualizarEstoque} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }} disabled={listaProdutoMov.length === 0}>Confirmar</Button>
          </div>
          
        </Box>
      </Modal>
    </div>
  )
}

export default ModalMov