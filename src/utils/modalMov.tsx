import React, { useEffect } from 'react'
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography, type SelectChangeEvent } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import ListaMovManual from "../componentes/ListaMovManual";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import type { iProduto } from "../type/iProduto";
import alertaMensagem from "./alertaMensagem";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale/pt-BR'
import { movimentacoesEstoque } from '../context/context';
import {gerarRelatorioPDF} from './gerarRelatorioPDF';
import { toZonedTime } from 'date-fns-tz';
import { Stack } from '@mui/material';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const ModalMov = () => {

    const {handleModal, setHandleModal} = useContext(AppContext);
    const {tipoModal, setTipoModal} = useContext(AppContext);
    const {estoqueSalvo, setEstoqueSalvo} = useContext(AppContext);
    const [produtoSelecionado, setProdutoSelecionado] = useState<iProduto | null>(null)
    const [valorMov, setValorMov] = useState('');
    const {listaProdutoMov, setListaProdutoMov} = useContext(AppContext);
    const [alertaAddProduto, setAlertaAddProduto] = useState<React.ReactNode | null>(null);
    const {tipoSaida, setTipoSaida} =useContext(AppContext);
    const {tipoEntrada, setTipoEntrada} = useContext(AppContext);
    const {listaHistoricoMovEstoque, setListaHistoricoMovEstoque } = useContext(AppContext);
    const listaTipoMovimentacoes = useContext(AppContext).listaTipoMovimentacoes;
    const {listaMovimentacoesEstoque, setListaMovimentacoesEstoque} = useContext(AppContext);
    const {tipoMovSelecionado, setTipoMovSelecionado} = useContext(AppContext);
    const {movimentacaoSelecionada, setMovimentacaoSelecionada} = useContext(AppContext);
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const estoqueId = useContext(AppContext).estoqueId;
    

  setTimeout(() =>{
    if(alertaAddProduto){
      setAlertaAddProduto(null)
    }
  },4000);

  useEffect(() => {

    if (tipoMovSelecionado === 'Entrada'){
      setListaMovimentacoesEstoque(movimentacoesEstoque.filter(mov => mov.toLowerCase().includes("entrada")));
    } else if (tipoMovSelecionado === "Saída") {
      setListaMovimentacoesEstoque(movimentacoesEstoque.filter(mov => mov.toLowerCase().includes("saída")));
    } else {
      setListaMovimentacoesEstoque(movimentacoesEstoque.filter(mov => mov.toLowerCase().includes("todas")));
    }

    setMovimentacaoSelecionada?.('');

    const listarMovimentacoes = async () => {

      try{
        const {data: {session}} = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token){
          setAlertaAddProduto(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
          return;
        }

        const response = await axios.get(`http://localhost:3000/estoque/lista-movimentacoes?estoqueId=${estoqueId}`,
          { headers: {Authorization: `Bearer ${token}`}}
        );

        setListaHistoricoMovEstoque(response.data);
        console.log(listaHistoricoMovEstoque)

      } catch (error) {
        if(axios.isAxiosError(error) && error.response){
          setAlertaAddProduto(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
        } else {
          setAlertaAddProduto(alertaMensagem(`Ocorreu um erro ao buscar o histórico de movimentações. Tente novamente. ${error}`, 'error', <ReportProblemIcon />));
        }
      }
    }

    listarMovimentacoes();

  },[tipoMovSelecionado, estoqueSalvo]);


  const cancelarEstoque = () =>{
    setHandleModal(false)
    setTipoModal("");
    setProdutoSelecionado(null)
    setValorMov('');
    setListaProdutoMov([]);
    setTipoSaida(null);
    setTipoEntrada(null);
    setDataFim(null);
    setDataInicio(null);
    if (setTipoMovSelecionado) {
      setTipoMovSelecionado('');
    }
    if (setMovimentacaoSelecionada) {
      setMovimentacaoSelecionada('');
    }
  }

  const selecaoProduto = (e: SelectChangeEvent) => {

    const produtoSelecionado = e.target.value;

    const produto = estoqueSalvo && estoqueSalvo.listaProdutos
      ? estoqueSalvo.listaProdutos.find(
          (p: iProduto) => String(p.id) === produtoSelecionado)
      : undefined;

    if (produto) {
      setProdutoSelecionado(produto);
    }
    setValorMov('');
    setTipoSaida(null);
  }

  const addProdutoLista = (produto: iProduto, qtdMov: number, tipoSaida: string | null, tipoEntrada: string | null, tipoMov: string, data: Date) => {
    const produtoExiste = listaProdutoMov.some(item => item.produto.id === produto.id);

    const timeZone = 'America/Sao_Paulo';
    const dataMov = toZonedTime(data, timeZone);

    if(qtdMov === 0){
      setAlertaAddProduto(alertaMensagem("Digite um valor", "warning", <ReportProblemIcon/>));
      return;
    }
  
    if (tipoModal === "Entrada" && !qtdMov  ||  qtdMov <= 0){
      setAlertaAddProduto(alertaMensagem("Valor incorreto", "warning", <ReportProblemIcon/>));
      return;
    }

    if (tipoModal === 'Saída' && qtdMov > (produto.estoque ?? 0)){
      setAlertaAddProduto(alertaMensagem("Quantidade insuficiente", "warning", <ReportProblemIcon/>));
      return;
    }

    if (tipoModal === 'Saída' && !qtdMov || isNaN(qtdMov)){
      setAlertaAddProduto(alertaMensagem("Valor incorreto", "warning", <ReportProblemIcon/>));
      return;
    }

    if( tipoModal === 'Saída' && !tipoSaida){
      setAlertaAddProduto(alertaMensagem("Selecione o tipo de saida", "warning", <ReportProblemIcon/>));
      return;
    }

    if (produtoExiste) {
      setAlertaAddProduto(alertaMensagem("Produto ja adicionado!", "warning", <ReportProblemIcon/>));
      return;
    }
  
    setListaProdutoMov([...listaProdutoMov, { produto, qtdMov, tipoSaida, tipoEntrada, tipoMov , dataMov}]);
    setValorMov('')
    setAlertaAddProduto(null)
    setProdutoSelecionado(null)
  }

  const atualizarEstoque = async () =>{

    try{

      if (listaProdutoMov.length === 0) {
        setAlertaAddProduto(alertaMensagem("Adicione produtos para atualizar o estoque", "warning", <ReportProblemIcon/>));
        return;
      }

      const {data: {session}} = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setAlertaAddProduto(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
        return;
      }    

      const promises = listaProdutoMov.map((mov)=>{

        const produtoId = Number(mov.produto?.id);
        const qtdMovi = Number(mov.qtdMov);
        const idEstoque = Number(estoqueId);
        const nomeProduto = String(mov.produto?.nome);

        return axios.patch(
          `http://localhost:3000/estoque/atualizar-produto/${produtoId}`,
          {
            tipoMov: tipoModal.toLowerCase() === 'entrada' ? 'entrada' : 'saida',
            tipoEntrada: tipoEntrada ? tipoEntrada : null,
            tipoSaida: tipoSaida ? tipoSaida : null,
            qtdMov: qtdMovi,
            estoqueId: idEstoque,
            nome: nomeProduto
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      });

      const responses = await Promise.all(promises);

      const novosEstoques = responses.map((res) => res.data);

      const novoEstoqueMap = new Map(novosEstoques.map((produto: iProduto) => [produto.id, produto]));

      const produtosAtualizados = estoqueSalvo && estoqueSalvo.listaProdutos
        ? estoqueSalvo.listaProdutos.map((produto: iProduto) => {
            const novoEstoque = novoEstoqueMap.get(produto.id);
            return novoEstoque
              ? {
                  ...produto,
                  estoque: novoEstoque.estoque,
                  estoqueSuficiente: (novoEstoque.estoque ?? 0) >= (produto.estoqueMinimo ?? 0),
                }
              : produto;
          })
        : [];

      if (estoqueSalvo) {
        setEstoqueSalvo({ ...estoqueSalvo, listaProdutos: produtosAtualizados });
      }

    } catch (error) {
      console.error("Erro ao atualizar o estoque:", error);
      setAlertaAddProduto(alertaMensagem("Erro ao atualizar estoque", "error", <ReportProblemIcon/>));

      if(axios.isAxiosError(error) && error.response){
        console.error("Erro ao atualizar o estoque:", error);
        setAlertaAddProduto(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
        return;
      } else {
        console.error("Erro ao atualizar o estoque:", error);
        setAlertaAddProduto(alertaMensagem(`Ocorreu um erro ao atualizar o estoque. Tente novamente. ${error}`, 'error', <ReportProblemIcon />));
        return;
      }
    }

  //   const historicoTemp: iProdutoMov[] = [];

  //   const estoqueAtualizado = estoqueSalvo.listaProdutos.map((produtoEstoque) =>{
  //     const prodMov = listaProdutoMov.find(
  //       (mov) => mov.produto.id === produtoEstoque.id
  //     );     
  
  //     if (prodMov && tipoModal === 'Entrada'){
  //       const novoEstoque = (produtoEstoque.estoque ?? 0) + prodMov.qtdMov;
  //       if(novoEstoque !== produtoEstoque.estoque){
  //         historicoTemp.push(prodMov)
  //       }   
  //       return { ...produtoEstoque, estoque: novoEstoque, estoqueSuficiente: novoEstoque >= (produtoEstoque.estoqueMinimo ?? 0) ? true : false }
  //     }
      
  //     if (prodMov && tipoModal === 'Saída'){
  //       const novoEstoque = (produtoEstoque.estoque ?? 0) - prodMov.qtdMov;
  //       if(novoEstoque !== produtoEstoque.estoque){
  //         historicoTemp.push(prodMov)
  //       } 
  //        return { ...produtoEstoque, estoque: novoEstoque, estoqueSuficiente: novoEstoque >= (produtoEstoque.estoqueMinimo ?? 0) ? true : false }
  //     } 

  //       return produtoEstoque;      
        
  // });

  // setEstoqueSalvo({ ...estoqueSalvo, listaProdutos: estoqueAtualizado })

  //   if (historicoTemp.length > 0 && setListaHistoricoMovEstoque && listaHistoricoMovEstoque) {
  //     setListaHistoricoMovEstoque([...listaHistoricoMovEstoque, ...historicoTemp]);
  //   }

    
    setHandleModal(false)
    setTipoModal('')
    setProdutoSelecionado({} as iProduto)
    setListaProdutoMov([]);
    setValorMov('')
    setTipoSaida(null)
    setTipoEntrada(null)
    setAlertaAddProduto(null)

  }

  const selecaoTipoSaida = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setTipoSaida((e.target as HTMLInputElement).value); 
      
  }

  const selecaoTipoMov = (e: SelectChangeEvent) => {
    setTipoMovSelecionado && setTipoMovSelecionado(e.target.value);
    setDataFim(null);
    setDataInicio(null);
  }

  const selecaoMovimentacao = (e: SelectChangeEvent) => {
    setMovimentacaoSelecionada && setMovimentacaoSelecionada(e.target.value);
  }

  const gerarRelatorioMovimentacao = () => {
    const timeZone = 'America/Sao_Paulo';

    try{

      if (tipoMovSelecionado === '' || movimentacaoSelecionada === '' || dataInicio === null || dataFim === null) {
        setAlertaAddProduto(alertaMensagem("Todos filtros são obrigatorios", "warning", <ReportProblemIcon/>));
        return;
      }

      const relatorioFiltrado = listaHistoricoMovEstoque.filter((mov) => {

        const filtroTipoMov = 
        tipoMovSelecionado === 'Entrada' 
          ? mov.tipoMov === 'entrada'
        :tipoMovSelecionado === 'Saída' 
          ? mov.tipoMov === 'saida'
        : true;

        const filtroTipoSaida =
        tipoMovSelecionado === 'Saída'
          ? movimentacaoSelecionada === 'Saída Manual - AVARIA'
            ? mov.tipoSaida === 'Avaria'
          : movimentacaoSelecionada === 'Saída Manual - VENDA'
            ? mov.tipoSaida === 'Venda'
          : true
        : true;

        const filtroTipoEntrada  =
        tipoMovSelecionado === 'Entrada'
          ? movimentacaoSelecionada === 'Entrada Manual'
            ? mov.tipoEntrada === 'Manual'
          : movimentacaoSelecionada === 'Entrada Pedido'
            ? mov.tipoEntrada === 'Pedido'
          : true
        : true;

        let filtroData = true;
        if (dataInicio && dataFim) {
          const inicio = toZonedTime(new Date(dataInicio), timeZone);
          inicio.setHours(0, 0, 0, 0);

          const fim = toZonedTime(new Date(dataFim), timeZone);
          fim.setHours(23, 59, 59, 999);

          const dataMov = toZonedTime(new Date(mov.dataMov), timeZone);
          filtroData = dataMov >= inicio && dataMov <= fim;
        }

      return filtroTipoMov && filtroTipoSaida && filtroTipoEntrada && filtroData;
        
      });
      
      if (relatorioFiltrado.length === 0) {
        setAlertaAddProduto(alertaMensagem("Nenhum resultado encontrado", "warning", <ReportProblemIcon/>));
        return;
      }

      console.log(relatorioFiltrado);

      gerarRelatorioPDF(relatorioFiltrado, tipoMovSelecionado,movimentacaoSelecionada,dataInicio, dataFim);

    } catch(error){
      console.error("Erro ao gerar o relatorio:", error);
      setAlertaAddProduto(alertaMensagem(`Erro ao buscar o histórico de movimentações`+ error, "error" , <ReportProblemIcon/>));
      return;
    }   
  }

  return (

    <div>
      <Modal
        open={handleModal}
        onClose={(_event: object,reason) => reason != 'backdropClick' && setHandleModal(false)}
        aria-labelledby="modal-estoque-title"
        aria-describedby="modal-estoque-description"
      >
        
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: {xs: '90vw', sm: '70%', md: '50%', lg: '40%'}
      }}
    >
          <Typography id="modal-estoque-title" variant="h6" component="h2" gutterBottom>
            {tipoModal === 'Entrada' ? 'Entrada Manual no estoque' : tipoModal === 'Saída' ? 'Saida Manual do estoque' : tipoModal === 'MovimentacaoEstoque' ? 'Relatorio Movimentação de estoque' : ''}
          </Typography>
          
          <div className="flex flex-col gap-3">
            {tipoModal === 'MovimentacaoEstoque' && (
              <Stack spacing={2} direction="column">
                <FormControl fullWidth required>
                    <InputLabel required id="tipo-label">Tipo</InputLabel>
                    <Select
                      displayEmpty
                      required
                      value={tipoMovSelecionado ? tipoMovSelecionado : ""}
                      onChange={selecaoTipoMov}
                      labelId="tipo-label"
                      label="Tipo"
                    >

                      {listaTipoMovimentacoes.map((tipo, index) => (
                        <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                      ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth required disabled={!tipoMovSelecionado}>
                  <InputLabel required id="mov-label">Movimentações</InputLabel>
                  <Select
                    displayEmpty
                    value={movimentacaoSelecionada ? movimentacaoSelecionada : ""}
                    onChange={selecaoMovimentacao}
                    labelId="mov-label"
                    label="Movimentações">

                      {listaMovimentacoesEstoque && listaMovimentacoesEstoque.map((mov, index) => (                    
                        <MenuItem key={index} value={mov}>{mov}</MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Periodo inicial"
                      value={dataInicio}
                      disabled={!movimentacaoSelecionada || !tipoMovSelecionado}
                      onChange={(newValue) => {
                        if (dataFim && newValue && newValue > dataFim) {
                          setAlertaAddProduto(alertaMensagem("Data inicial não pode ser maior que a final", "warning", <ReportProblemIcon/>));
                          } else {
                          setAlertaAddProduto(null);
                          setDataInicio(newValue);                   
                        }
                      }}                      
                      maxDate={dataFim || undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          },
                        }}
                      />
                </LocalizationProvider>
                        
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                      <DatePicker
                        format="dd/MM/yyyy"
                        label="Periodo Final"
                        value={dataFim}
                        onChange={(newValue) => {
                        if (dataInicio && newValue && newValue < dataInicio) {
                          setAlertaAddProduto(alertaMensagem("Data final não pode ser maior que a Inicial", "warning", <ReportProblemIcon/>));
                          } else {
                          setAlertaAddProduto(null);
                          setDataFim(newValue);                   
                          }
                        }} 
                        disabled={!movimentacaoSelecionada || !tipoMovSelecionado}
                        minDate={dataInicio || undefined}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            },
                          }}
                      />
                </LocalizationProvider>         
              </Stack>            
            )}   

            {tipoModal !== 'MovimentacaoEstoque' && (
              <Stack spacing={2} direction="column" justifyContent={"center"} alignItems={"center"}>
                  <FormControl fullWidth required>
                    <InputLabel required id="produto-label">Selecione o produto</InputLabel>
                    <Select
                      value={produtoSelecionado ? String(produtoSelecionado.id) : ""}
                      onChange={selecaoProduto}
                      displayEmpty
                      labelId="produto-label"
                      id="produto-select"
                      label="Selecione o produto"
                    >
                      {estoqueSalvo && estoqueSalvo.listaProdutos && estoqueSalvo.listaProdutos.length > 0 ? (
                        estoqueSalvo.listaProdutos.map((produto: iProduto) => (
                          <MenuItem key={produto.id} value={String(produto.id)}>{produto.nome}</MenuItem>
                        ))
                      ) : null}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required>
                    <TextField disabled={true} value={produtoSelecionado ? produtoSelecionado.estoque ?? "" : ""} label="Estoque Atual"></TextField>
                  </FormControl>

                  <FormControl fullWidth required error={Number(valorMov) < 0}>
                    <Stack direction={"row"} spacing={2} justifyContent="start" alignItems="center">
                      <TextField  required  type='number'  value={valorMov === null ? '' : valorMov} onChange={(e) => setValorMov(e.target.value)} disabled={!produtoSelecionado || !produtoSelecionado.id} label={tipoModal === 'Entrada' ? 'Entrada Manual' : tipoModal === 'Saída' ? 'Saida Manual' : ''} error={Number(valorMov) < 0}></TextField>
                      <Button
                        onClick={() => {
                          if (produtoSelecionado) {
                            addProdutoLista(produtoSelecionado, Number(valorMov), tipoSaida, tipoEntrada, tipoModal, new Date());
                          }
                        }}
                        sx={{ backgroundColor: "#4CAF50", color: "#fff", '&:hover': { backgroundColor: "#388E3C" } }}
                        disabled={!produtoSelecionado || !produtoSelecionado.id}
                      >
                        <span className="text-xl">+</span>
                      </Button>
                    </Stack>

                    <FormHelperText>
                      {Number(valorMov) < 0 ? "Valor deve ser maior que zero" : ""}
                    </FormHelperText>
                  </FormControl>
                </Stack>           
            )}

            {alertaAddProduto && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alertaAddProduto}</Box>}     
          
            {tipoModal === 'Saída' && (
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

          {tipoModal !== 'MovimentacaoEstoque' && (
            <ListaMovManual />
          )}
           
          
          <div className="flex flex-row gap-2">
            <Button  variant="contained" onClick={cancelarEstoque} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }}>Cancelar</Button>
            { tipoModal === 'MovimentacaoEstoque' ? (
              <Button variant="contained" onClick={gerarRelatorioMovimentacao} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }} >Gerar</Button>
            ) : (
              <Button variant="contained" onClick={atualizarEstoque} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }} disabled={listaProdutoMov.length === 0}>Confirmar</Button>
            )}
          </div>
          
        </Box>
      </Modal>
    </div>
  )
}

export default ModalMov