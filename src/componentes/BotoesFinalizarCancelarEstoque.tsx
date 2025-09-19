import {  Box, Button, Stack } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CheckIcon from '@mui/icons-material/Check';
import { AppContext } from '../context/context';
import { useContext, useState } from 'react';
import CirculoProgresso from '../componentes/circuloProgresso';
import ErrorIcon from '@mui/icons-material/Error';
import alertaMensagem from '../utils/alertaMensagem';
import { useNavigate } from 'react-router-dom';
import CaixaDialogo from '../utils/caixaDialogo';
import axios from 'axios';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { supabase } from '../supabaseClient';


const BotoesFinalizarCancelarEstoque = () => {

  const navigate = useNavigate();
  const {setListaProdutoEstoque, listaProdutoEstoque} = useContext(AppContext);
  const {contQtdEstoque, setContQtdEstoque} = useContext(AppContext);
  const [progresso, setProgresso] = useState(0);
  const [mostraProgresso, setMostraProgresso] = useState(false);
  const [mensagemEstoqueSalvo, setMensagemEstoqueSalvo] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<React.ReactNode | null>(null);
  const setMostrarCaixaDialogo = useContext(AppContext).setMostrarCaixaDialogo;
  const{setTipoInput} = useContext(AppContext);

  const salvarEstoque = async () => {

    const {data: {session}} = await supabase.auth.getSession();
    const token = session?.access_token;

    const userId = session?.user.id;
    
    const { data: tabela } = await supabase
    .from('estoque')
    .select('id')
    .eq('user_id', userId) 
    .maybeSingle();

    if(tabela){
      setMensagemErro(alertaMensagem('Você ja possui um estoque criado.', 'warning', <ReportProblemIcon/>));
      return;
    }

    if (!session){
      setMensagemErro(alertaMensagem('Faça login para salvar um estoque.', 'warning', <ReportProblemIcon/>));
      navigate("/pagina-login")
      return;
    }

    if (!token){
      setMensagemErro(alertaMensagem('Token de acesso não encontrado.', 'warning', <ReportProblemIcon/>));
      navigate("/pagina-login")
      return;
    }

    const produtoSemUnidade = listaProdutoEstoque.some(produto => !produto.uniMedida);

    if (produtoSemUnidade) {
      setMensagemErro(alertaMensagem('Preencha o campo Unidades no(s) produto(s)', 'warning', <ErrorIcon/>));
      return;
    }

    if (listaProdutoEstoque.length === 0 || contQtdEstoque === 0) {
        alert("Não há produtos no estoque para salvar.");
        return;
    }

      const novoEstoque = {
        data: new Date().toISOString(),
        listaProdutos: listaProdutoEstoque,
        contQtdEstoque: Number(contQtdEstoque)
      };

      document.body.style.pointerEvents = "none";
      setMostraProgresso(true);
      setProgresso(0);

      let progressoAtual = 0;
      const intervaloProgresso = setInterval(() => {
      progressoAtual += 10;
      if (progressoAtual <= 90) {
          setProgresso(progressoAtual);
      }
    }, 100);

    try{

      const response = await axios.post ('http://localhost:3000/estoque/criar-estoque', novoEstoque,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      clearInterval(intervaloProgresso)
      setProgresso(100);
      setMostrarCaixaDialogo(true);
      setMensagemErro(false);
      setListaProdutoEstoque([]);
      setContQtdEstoque(0);

    } catch (error) {
      clearInterval(intervaloProgresso);
      setProgresso(0)
      setMensagemEstoqueSalvo(false)
      setMensagemErro(alertaMensagem(`Ocorreu um erro ao salvar o estoque. Tente novamente. ${error}`, 'warning', <ErrorIcon/>));
    
      if(axios.isAxiosError(error) && error.response){
        setMensagemErro(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ErrorIcon/>));
      } else {
        setMensagemErro(alertaMensagem(`Ocorreu um erro ao salvar o estoque. Tente novamente. ${error}`, 'error', <ErrorIcon />));
      } 
    } finally {
      setMostraProgresso(false);
      setTipoInput('auto')
      document.body.style.pointerEvents = "";

    }
  }
  
  const cancelarEstoque = () =>{
    setListaProdutoEstoque([]);
    setContQtdEstoque(0);
    setTipoInput("auto");
  }

  const sairEstoque = () =>{
    setListaProdutoEstoque([]);
    setContQtdEstoque(0);
    navigate("/pagina-inicial")
    setTipoInput("auto");
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      {mostraProgresso && (
        <div className="bg-white/80 rounded-full shadow-lg p-6 pointer-events-auto">
        <CirculoProgresso progresso={progresso} />
        </div>
      )}
      </div>
      
      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end"}}>     
        <Button variant="contained" startIcon={<SaveIcon/>} disabled={listaProdutoEstoque.length === 0} sx={{ backgroundColor: "#06D001", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#059212",},}} onClick={salvarEstoque}>Finalizar</Button>
        <Button variant="contained" startIcon={<CancelIcon/>} disabled={listaProdutoEstoque.length === 0} sx={{ backgroundColor: "#C70039", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#900C3F",},}} onClick={cancelarEstoque}>Cancelar</Button>
        <Button variant="contained" startIcon={<ExitToAppIcon/>} sx={{ backgroundColor: "#393E46", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#222831",},}} onClick={sairEstoque} >Sair</Button>
      </Stack>

      {mensagemEstoqueSalvo && (
      <div className="fixed inset-0 flex items-center justify-center z-[1301] pointer-events-none font-size: 1.5rem ">
        <div className="pointer-events-auto">
          {alertaMensagem("Estoque salvo com sucesso", 'success', <CheckIcon/>)}
        </div>
      </div>
      )}

      {mensagemErro && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{mensagemErro}</Box>}
 
      {mensagemEstoqueSalvo && setTimeout(() => setMensagemEstoqueSalvo(false), 3000)}
      {mensagemErro && setTimeout(() => setMensagemErro(false), 3000)}

      <CaixaDialogo
        titulo="Estoque criado com sucesso!"
        texto="O que deseja fazer agora?"
        botão="Gerenciar Estoque"
      />

    </>
  )
}

export default BotoesFinalizarCancelarEstoque