import React, { useEffect } from 'react'
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography, type SelectChangeEvent } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import ListaFornecedor from '../componentes/ListaFornecedor';
import DoneIcon from '@mui/icons-material/Done';
import type { iPedido } from '../type/iPedido';
import { useInternet } from '../context/StatusServidorProvider';
import { useEstoque } from '../context/EstoqueProvider';

interface ModalMovProps{
  atualizarPedidos?: () => void;
}


const ModalMov = ({atualizarPedidos}: ModalMovProps ) => {

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
    const [razaoSocial, setRazaoSocial] = useState('');
    const [telefone, setTelefone] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [errorTel, setErrorTel] = useState(false);
    const [errorCel, setErrorCel] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [notiEmail, setNotiEmail] = useState(false);
    const [notiWhats, setNotiWhats] = useState(false);
    const {listaFornecedores, setListaFornecedores} = useContext(AppContext);
    const [iDfornecedorSelecionado, setiDFornecedorSelecionado] = useState<string>('');
    const {listaPedidosCompra, setListaPedidosCompra} = useContext(AppContext);
    const StatusServidorContext = useInternet();
    const estoqueContext = useEstoque();
    const {origemDoModal, setOrigemDoModal} = useContext(AppContext);

    const existeEstoque = estoqueContext?.existeEstoque;
    const conexaoInternet = StatusServidorContext?.conexaoInternet;
    const servidorOnline = StatusServidorContext?.servidorOnline;

    

  setTimeout(() =>{
    if(alertaAddProduto){
      setAlertaAddProduto(null)
    }
  },4000);

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

      } catch (error) {
        if(axios.isAxiosError(error) && error.response){
          setAlertaAddProduto(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
          return;
        } else {
          setAlertaAddProduto(alertaMensagem(`Ocorreu um erro ao buscar o histórico de movimentações. Tente novamente em instantes. ${error}`, 'error', <ReportProblemIcon />));
          return;
        }
      }
    }

  const listarFornecedores = async () => {
      
      const {data: {session}} = await supabase.auth.getSession();
      const token = session?.access_token;

      try{

        if (!token){
          setAlertaAddProduto(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
          return;
        }

        const response = await axios.get(`http://localhost:3000/fornecedor/listar-fornecedores`,
          { headers: {Authorization: `Bearer ${token}`}}
        );

        setListaFornecedores(response.data);

      } catch (error) {
        if(axios.isAxiosError(error) && error.response){
          console.log(error);
          setAlertaAddProduto(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
          return;
        } else {
          console.log(error);
          setAlertaAddProduto(alertaMensagem(`Ocorreu um erro ao buscar a lista de fornecedores. ${error}`, 'error', <ReportProblemIcon />));
          return;
        }
      }

  }

  useEffect(() =>{
    if (tipoModal === 'CriarPedidoCompra' || tipoModal === 'CadastroFornecedor'){
      listarFornecedores();
    }
  }, [tipoModal]);

  useEffect(() => {

    if (tipoModal === 'MovimentacaoEstoque'){   
      if (tipoMovSelecionado === 'Entrada'){
        setListaMovimentacoesEstoque(movimentacoesEstoque.filter(mov => mov.toLowerCase().includes("entrada")));
      } else if (tipoMovSelecionado === "Saída") {
        setListaMovimentacoesEstoque(movimentacoesEstoque.filter(mov => mov.toLowerCase().includes("saída")));
      } else {
        setListaMovimentacoesEstoque(movimentacoesEstoque.filter(mov => mov.toLowerCase().includes("todas")));
      }

      setMovimentacaoSelecionada?.('');

      listarMovimentacoes(); 
    }

  },[tipoMovSelecionado, estoqueSalvo, tipoModal]);


  const btnCancelar= () =>{
    setAlertaAddProduto(null)
    setRazaoSocial('');
    setTelefone('');
    setCelular('');
    setEmail('');
    setErrorTel(false);
    setErrorCel(false);
    setErrorEmail(false);
    setNotiEmail(false);
    setNotiWhats(false);
    setHandleModal(false)
    setTipoModal("");
    setProdutoSelecionado(null)
    setValorMov('');
    setListaProdutoMov([]);
    setTipoSaida(null);
    setTipoEntrada(null);
    setDataFim(null);
    setDataInicio(null);
    setiDFornecedorSelecionado('');
    if (setTipoMovSelecionado) {
      setTipoMovSelecionado('');
    }
    if (setMovimentacaoSelecionada) {
      setMovimentacaoSelecionada('');
    }

    if(tipoModal === 'CadastroFornecedor'){
      setTipoModal('CriarPedidoCompra');
    }

  }

  const btnCancelarFornecedor = () =>{
    setAlertaAddProduto(null)
    setRazaoSocial('');
    setTelefone('');
    setCelular('');
    setEmail('');
    setErrorTel(false);
    setErrorCel(false);
    setErrorEmail(false);
    setNotiEmail(false);
    setNotiWhats(false);
    if(origemDoModal === 'modalCriarPedido'){
      setTipoModal('CriarPedidoCompra');
    }else{
      btnCancelar();
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

      if(axios.isAxiosError(error)){

        if(!conexaoInternet ){
          console.error("Sem acesso a internet. Verifique sua conexão", error);
          setAlertaAddProduto(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
          return;
        }

        if(!servidorOnline){
          console.error("Servidor fora do ar. Tente novamente em instantes", error);
          setAlertaAddProduto(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
          return;
        }

        if(error.response){
          const status = error.response.status;
          const mensagem = error.response.data?.message || error.message;

          if(status >= 500){
            console.error(`Erro ao atualizar estoque ${status} ${mensagem}`)
            setAlertaAddProduto(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
          } else if (status === 404){
            console.error(`Erro ao atualizar estoque ${status} ${mensagem}`)
            setAlertaAddProduto(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
          } else {
            console.error(`Erro ao atualizar estoque ${status} ${mensagem}`)
            setAlertaAddProduto(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
          }

           return;
        }

        if(error.code === 'ECONNABORTED'){
          console.error(`Erro ao atualizar estoque ${error}`)
          setAlertaAddProduto(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
          return;
        }

        setAlertaAddProduto(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
        return;    
      }

      setAlertaAddProduto(alertaMensagem(`Erro inesperado. Tente novamente. ${String(error)}`, "error", <ReportProblemIcon />));
      return;
    }
      
    
    setHandleModal(false)
    setTipoModal('')
    setProdutoSelecionado({} as iProduto)
    setListaProdutoMov([]);
    setValorMov('')
    setTipoSaida(null)
    setTipoEntrada(null)
    setAlertaAddProduto(null)

  }

  const criarPedidoCompra = async () =>{

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

      if (!session){
          setAlertaAddProduto(alertaMensagem('Faça login para salvar um estoque.', 'warning', <ReportProblemIcon/>));
          return;
      }

      const timeZone = 'America/Sao_Paulo';
      const agora = new Date();
      const dtCriacao = toZonedTime(new Date(agora),timeZone);

      const pedidoNovo = {       
        data_criacao: dtCriacao, 
        status: "pendente", 
        fornecedor_id: iDfornecedorSelecionado, 
        estoque_id: estoqueId,
        itens: listaProdutoMov.map((mov) => ({
          produto_id: mov.produto?.id,
          qtd_solicitado: mov.qtdMov
        }))
      };

      try {
        const response = await axios.post('http://localhost:3000/pedido/criar-pedido', pedidoNovo,
        {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pedidoCriado: iPedido = response.data;

        setAlertaAddProduto(alertaMensagem("Pedido de compra criado com sucesso", "success", <DoneIcon/>));

        if(atualizarPedidos){
          atualizarPedidos();
        }
        
        const novaListaPedidos = [...listaPedidosCompra, pedidoCriado];
        setListaPedidosCompra(novaListaPedidos);
        


      } catch (error) {
      console.error("Erro ao criar pedido de compra", error);
      setAlertaAddProduto(alertaMensagem("Erro ao criar pedido de compra", "error", <ReportProblemIcon/>));

      if(axios.isAxiosError(error)){

        if(!conexaoInternet ){
          console.error("Sem acesso a internet. Verifique sua conexão", error);
          setAlertaAddProduto(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
          return;
        }

        if(!servidorOnline){
          console.error("Servidor fora do ar. Tente novamente em instantes", error);
          setAlertaAddProduto(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
          return;
        }

        if(error.response){
          const status = error.response.status;
          const mensagem = error.response.data?.message || error.message;

          if(status >= 500){
            console.error(`Erro ao criar pedido de compra ${status} ${mensagem}`)
            setAlertaAddProduto(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
          } else if (status === 404){
            console.error(`Erro ao criar pedido de compra ${status} ${mensagem}`)
            setAlertaAddProduto(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
          } else {
            console.error(`Erro ao criar pedido de compra${status} ${mensagem}`)
            setAlertaAddProduto(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
          }

           return;
        }

        if(error.code === 'ECONNABORTED'){
          console.error(`Erro ao criar pedido de compra ${error}`)
          setAlertaAddProduto(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
          return;
        }

        setAlertaAddProduto(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
        return;    
      }

      setAlertaAddProduto(alertaMensagem(`Erro inesperado. Tente novamente. ${String(error)}`, "error", <ReportProblemIcon />));
      return;
      }


    setProdutoSelecionado({} as iProduto)
    setListaProdutoMov([]);
    setValorMov('')
    setTipoSaida(null)
    setTipoEntrada(null)
    setiDFornecedorSelecionado('');
        
  }

  const CadastroFornecedor = () => {
    setTipoModal('CadastroFornecedor');
    setHandleModal(true);
  }

  const criarFornecedor = async () =>{

      const {data: {session}} = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setAlertaAddProduto(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
        return;
      }

      if (!session){
          setAlertaAddProduto(alertaMensagem('Faça login para salvar o fornecedor.', 'warning', <ReportProblemIcon/>));
           return;
      }

      if(errorTel || errorCel || errorEmail){
        setAlertaAddProduto(alertaMensagem("Corrija os erros nos campos", "warning", <ReportProblemIcon/>));
        return;
      }

      const fornecedorNovo = {
        nome: razaoSocial,
        telefone: telefone,
        whatsApp: celular,
        email: email,
        noti_email: notiEmail,
        noti_whatsapp: notiWhats
      }

      try {
          await axios.post('http://localhost:3000/fornecedor/criar-fornecedor', fornecedorNovo,
          {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error("Erro ao criar fornecedor", error);
          setAlertaAddProduto(alertaMensagem("Erro ao criar fornecedor", "error", <ReportProblemIcon/>));

          if(axios.isAxiosError(error)){

            if(!conexaoInternet ){
              console.error("Sem acesso a internet. Verifique sua conexão", error);
              setAlertaAddProduto(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
              return;
            }

            if(!servidorOnline){
              console.error("Servidor fora do ar. Tente novamente em instantes", error);
              setAlertaAddProduto(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
              return;
            }

            if(error.response){
              const status = error.response.status;
              const mensagem = error.response.data?.message || error.message;

              if(status >= 500){
                console.error(`Erro ao criar fornecedor ${status} ${mensagem}`)
                setAlertaAddProduto(alertaMensagem("Erro interno no servidor. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
              } else if (status === 404){
                console.error(`Erro ao criar fornecedor ${status} ${mensagem}`)
                setAlertaAddProduto(alertaMensagem("Recurso não encontrado. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
              } else {
                console.error(`Erro ao criar fornecedor ${status} ${mensagem}`)
                setAlertaAddProduto(alertaMensagem(`Erro na API: ${status || mensagem}`, 'warning', <ReportProblemIcon/>));
              }

              return;
            }

            if(error.code === 'ECONNABORTED'){
              console.error(`Erro ao criar fornecedor ${error}`)
              setAlertaAddProduto(alertaMensagem("Tempo de resposta excedido. Tente novamente.", "warning",  <ReportProblemIcon/>));
              return;
            }

            setAlertaAddProduto(alertaMensagem(`Erro de rede: ${error.message}`, "warning",  <ReportProblemIcon/>));
            return;    
          }

      setAlertaAddProduto(alertaMensagem(`Erro inesperado. Tente novamente. ${String(error)}`, "error", <ReportProblemIcon />));
      return;
        }

      setRazaoSocial('');
      setTelefone('');
      setCelular('');
      setEmail('');
      setErrorTel(false);
      setErrorCel(false);
      setErrorEmail(false);
      setNotiEmail(false);
      setNotiWhats(false);
      if(origemDoModal === 'modalCriarPedido'){
        setTipoModal('CriarPedidoCompra');
      }else{
        btnCancelar();
      }

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

    if(!conexaoInternet ){
      console.error("Sem acesso a internet. Verifique sua conexão");
      setAlertaAddProduto(alertaMensagem("Sem acesso a internet. Verifique sua conexão", 'warning', <ReportProblemIcon/>));
      return;
    }

    if(!servidorOnline){
      console.error("Servidor fora do ar. Tente novamente em instantes");
      setAlertaAddProduto(alertaMensagem("Servidor fora do ar. Tente novamente em instantes", 'warning', <ReportProblemIcon/>));
      return;
    }

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

      gerarRelatorioPDF(relatorioFiltrado, tipoMovSelecionado,movimentacaoSelecionada,dataInicio, dataFim);

    } catch (error) {
      console.error("Erro ao gerar relatorio:", error);
      setAlertaAddProduto(alertaMensagem("Erro ao gerar relatorio", "error", <ReportProblemIcon/>));
    }   
  }

  const checkNotificacao = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setNotiEmail(value);
    setNotiWhats(value);
  };

  const checkEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotiEmail(event.target.checked);
  };

  const checkWhats = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotiWhats(event.target.checked);
  };

  const inputTelefone = (value: string) => {
    const somenteNumeros = value.replace(/\D/g, "");

    let semCodigoPais = somenteNumeros.startsWith('55') ? somenteNumeros.slice(2) : somenteNumeros;

    if(semCodigoPais.startsWith('0')) {
      semCodigoPais = semCodigoPais.slice(1);
    }

    let numeroFormatado = semCodigoPais;

    
    numeroFormatado = semCodigoPais.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");

    setTelefone(numeroFormatado);
    
  }

  const inputCelular = (value: string) => {
    const somenteNumeros = value.replace(/\D/g, "");

    let semCodigoPais = somenteNumeros.startsWith('55') ? somenteNumeros.slice(2) : somenteNumeros;

    if(semCodigoPais.startsWith('0')){
      semCodigoPais = semCodigoPais.slice(1);
    }

    let numeroFormatado = semCodigoPais;

    numeroFormatado = semCodigoPais.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");

    setCelular(numeroFormatado);
  }

  const verificaTel = () => {

    if(!telefone){
      setErrorTel(false);
      return;
    }

    const isValid = telefone.length === 14;
    setErrorTel(!isValid);
  }

  const verificaCel = () => {

    if(!celular){
      setErrorCel(false);
      return
    }

    const isValid = celular.length === 15;
    setErrorCel(!isValid);
  }

  const verificaEmail = () => {

    if(!email){
      setErrorEmail(false);
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrorEmail(!regex.test(email));
  }

  const todosNotificacoes = notiEmail && notiWhats; 
  const algumaNotificacao = notiEmail || notiWhats;

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 3 }}>
      <FormControlLabel disabled={!razaoSocial}
        label="Email"
        control={<Checkbox checked={notiEmail} onChange={checkEmail} />}
      />
      <FormControlLabel disabled={!razaoSocial}
        label="WhatsApp"
        control={<Checkbox checked={notiWhats} onChange={checkWhats} />}
      />
    </Box>
  );

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
            width: tipoModal === 'CadastroFornecedor' ? {xs: '90vw', sm: '45%', md: '55%', lg: '65%'} : {xs: '90vw', sm: '70%', md: '50%', lg: '40%'} }}
        >
            <Typography id="modal-estoque-title" variant="h6" component="h2" gutterBottom>
              {tipoModal === 'Entrada' ? 'Entrada Manual no estoque' : tipoModal === 'Saída' ? 'Saida Manual do estoque' : tipoModal === 'MovimentacaoEstoque' ? 'Relatorio Movimentação de estoque' : tipoModal === 'CriarPedidoCompra' ? 'Criar Pedido de Compra' : tipoModal === 'CadastroFornecedor' ? 'Cadastrar Fornecedor' : ''}
            </Typography>
            
            <div className="flex flex-col gap-3">

              {tipoModal === 'CadastroFornecedor' && (
                <Stack direction="column"  justifyContent={"center"} alignItems={"center"}>
                    <FormControl  fullWidth required>
                      <Stack direction={"column"}  justifyContent="center" alignItems="start" spacing={1}>
                        <TextField fullWidth required label='Razão Social' type='text' value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)}></TextField>
                        
                        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>                        
                          <TextField  disabled={!razaoSocial} fullWidth label='Telefone' placeholder='(99) 9999-9999' value={telefone} onChange={(e) => inputTelefone(e.target.value)} onBlur={verificaTel} error={errorTel} helperText={errorTel ? "Número inválido" : ""}/>
                          <TextField disabled={!razaoSocial} fullWidth label='Celular' placeholder='(99) 99999-9999' value={celular} onChange={(e) => inputCelular(e.target.value)} onBlur={verificaCel} error={errorCel} helperText={errorCel ? "Número inválido" : ""}/>
                        </Stack>                       
                        
                        <TextField disabled={!razaoSocial} fullWidth label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} onBlur={verificaEmail} error={errorEmail} helperText={errorEmail ? "Email inválido" : ""}></TextField>
                        <FormControlLabel disabled={!razaoSocial} 
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              Notificações 
                              <Tooltip
                                title={
                                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                    Ao finalizar um pedido de compra, o fornecedor pode ser notificado por e-mail ou WhatsApp.<br />
                                    Para isso, ative a opção desejada e certifique-se de que os campos de e-mail e celular estão preenchidos corretamente.
                                  </span>
                                }
                              >
                                <HelpOutlineIcon sx={{ bgcolor: 'yellow', borderRadius: '100%' }} />
                              </Tooltip>
                            </Box>
                          }
                          control={
                          <Checkbox 
                            checked={todosNotificacoes}
                            indeterminate={!todosNotificacoes && algumaNotificacao}
                            onChange={checkNotificacao}/>
                          }/>
                          {children}
                      </Stack>
                      
                    </FormControl>
                  </Stack> 
              )}

              {tipoModal === 'CriarPedidoCompra' && (
                <>
                  <FormControl fullWidth required>
                    <Stack direction="row" spacing={1}>
                      <FormControl fullWidth>
                        <InputLabel id="fornecedor-label">Selecione o fornecedor</InputLabel>
                        <Select
                          labelId="fornecedor-label"
                          id="fornecedor-select"
                          value={iDfornecedorSelecionado}
                          onChange={(e) => setiDFornecedorSelecionado(e.target.value)}
                          displayEmpty
                          label="Selecione o fornecedor">
                            {listaFornecedores.map((fornecedor) => (
                              <MenuItem key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>

                      <Button onClick={CadastroFornecedor} startIcon={<PersonAddIcon/>} sx={{backgroundColor: "#e78a11ff",color: "#fff",minWidth: "40px",'&:hover': { backgroundColor: "#6b3e03ff" },}}></Button>
                    </Stack>
                  </FormControl>


                  <Stack spacing={2} direction="column" justifyContent={"center"} alignItems={"center"}>
                      <FormControl fullWidth required>
                        <InputLabel required id="produto-label">Selecione o produto</InputLabel>
                        <Select
                          value={produtoSelecionado ? String(produtoSelecionado.id) : ""}
                          onChange={selecaoProduto}
                          displayEmpty
                          labelId="produto-label"
                          disabled={!iDfornecedorSelecionado}
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
                        <Stack direction="row" spacing={2}>
                          <TextField
                            disabled={true}
                            value={produtoSelecionado ? produtoSelecionado.estoque ?? "" : ""}
                            label="Estoque Atual"
                            fullWidth
                          />
                          <TextField
                            disabled={true}
                            value={produtoSelecionado ? produtoSelecionado.estoqueMinimo ?? "" : ""}
                            label="Estoque Minimo"
                            fullWidth
                          />
                          <TextField
                            disabled={true}
                            value={produtoSelecionado ? produtoSelecionado.estoqueMaximo ?? "" : ""}
                            label="Estoque Maximo"
                            fullWidth
                          />
                        </Stack>
                      </FormControl>

                      <FormControl fullWidth required error={Number(valorMov) < 0}>
                        <Stack direction={"row"} spacing={2} justifyContent="start">
                          <TextField  required  type='number'  value={valorMov === null ? '' : valorMov} onChange={(e) => setValorMov(e.target.value)} disabled={!produtoSelecionado || !produtoSelecionado.id} label={tipoModal === 'CriarPedidoCompra' ? 'Reposição' : ''} error={Number(valorMov) < 0}></TextField>
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
                  </>
              )}

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

              {(tipoModal === 'Entrada' || tipoModal === 'Saída') && (
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

            {tipoModal !== 'MovimentacaoEstoque' && tipoModal !== 'CadastroFornecedor' && (
              <ListaMovManual />
            )}

            {tipoModal === 'CadastroFornecedor' && (
              <ListaFornecedor/>
            )}
            
            
            <div className="flex flex-row gap-2">
              {tipoModal !== 'CadastroFornecedor' ? (
                <Button  variant="contained" onClick={btnCancelar} sx={{backgroundColor: "#f44336",color: "#fff",fontWeight: "bold", borderRadius: "20px",border: "2px solid #fff",paddingX: 3,"&:hover": {backgroundColor: "#d32f2f",},}}>Cancelar</Button>         
              ) : (
                <Button  variant="contained" onClick={btnCancelarFornecedor} sx={{backgroundColor: "#f44336",color: "#fff",fontWeight: "bold", borderRadius: "20px",border: "2px solid #fff",paddingX: 3,"&:hover": {backgroundColor: "#d32f2f",},}}>Cancelar</Button>
              )}
              { tipoModal === 'MovimentacaoEstoque' ? (
                <Button variant="contained" onClick={gerarRelatorioMovimentacao} sx={{backgroundColor: "#4caf50",color: "#fff",fontWeight: "bold", borderRadius: "20px",border: "2px solid #fff",paddingX: 3,"&:hover": {backgroundColor: "#388e3c",},}} >Gerar</Button>
              ) : tipoModal === 'Entrada' || tipoModal === 'Saída' ?  (
                <Button variant="contained" onClick={atualizarEstoque} sx={{backgroundColor: "#4caf50",color: "#fff",fontWeight: "bold", borderRadius: "20px",border: "2px solid #fff",paddingX: 3,"&:hover": {backgroundColor: "#388e3c",},}} disabled={listaProdutoMov.length === 0}>Confirmar</Button>
              ) : tipoModal === 'CriarPedidoCompra' ? (
                <Button variant="contained" onClick={criarPedidoCompra} sx={{ mt: 2, backgroundColor: "#4ED7F1", color: "black" }} disabled={listaProdutoMov.length === 0}>Criar Pedido</Button>
              ) : tipoModal === 'CadastroFornecedor' ? (
                <Button variant="contained" onClick={criarFornecedor} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff",},}}  disabled={!razaoSocial} >Criar Fornecedor</Button>
              ) : null}
            </div>
            
        </Box>
      </Modal>
    </div>
  )
}

export default ModalMov