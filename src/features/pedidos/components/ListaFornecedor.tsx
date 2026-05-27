import { useContext, useState } from "react";
import { AppContext } from "../../../shared/context/context";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, FormControlLabel, FormGroup, Modal, Stack, TextField, Typography } from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import type { iFornecedor } from "../../../shared/type/iFornecedor";
import { supabase } from "../../../supabaseClient";
import axios from "axios";
import alertaMensagem from "../../../shared/components/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';


const ListaFornecedor = () => {

  const {listaFornecedores, setListaFornecedores} = useContext(AppContext);
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const [abrir, setAbrir] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<iFornecedor | null>(null);
  const [nome, setNome] = useState<string>('');
  const [celular, setCelular] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [noti_whatsapp, setNoti_whatsapp] = useState<boolean>(false);
  const [noti_email, setNoti_email] = useState<boolean>(false);
  const [errorTel, setErrorTel] = useState(false);
  const [errorCel, setErrorCel] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);


  setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);

  const estiloModal = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '92vw', sm: 420 },
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    padding: '24px',
  };

  const handleAbrirDialog = (fornecedor: iFornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setAbrir(true);
  }

  const handleFecharDialog = () => {
    setAbrir(false);
    setFornecedorSelecionado(null);
  }

  const abrirModalEditar = (fornecedor: iFornecedor) => {
    setModalAberto(true);
    setFornecedorSelecionado(fornecedor);
    setNome(fornecedor.nome);
    setTelefone(fornecedor.telefone || '');
    setCelular(fornecedor.whatsApp || '');
    setEmail(fornecedor.email || '');
    setNoti_whatsapp(fornecedor.noti_whatsapp || false);
    setNoti_email(fornecedor.noti_email || false);
    
  }

  const fecharModalEditar = () => {
    setModalAberto(false);
    setFornecedorSelecionado(null);
    setNome('');
    setTelefone('');
    setCelular('');
    setEmail('');
    setNoti_whatsapp(false);
    setNoti_email(false);
    setErrorTel(false);
    setErrorCel(false);
    setErrorEmail(false);
    setAlerta(null);
  }

  const salvarEdicao = async (fornecedor: iFornecedor) => {
    const {data: {session}} = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (!token) {
      setAlerta(alertaMensagem("Token de acesso não encontrado.", 'warning', <ReportProblemIcon />));
      return;
    }
    
    if (!session){
      setAlerta(alertaMensagem('Faça login para salvar o fornecedor.', 'warning', <ReportProblemIcon/>));
      return;
    }
    
    if(errorTel || errorCel || errorEmail){
      setAlerta(alertaMensagem("Corrija os erros nos campos", "warning", <ReportProblemIcon/>));
      return;
    }

    const fornecedorEditado = {
        nome: nome,
        telefone: telefone,
        whatsApp: celular,
        email: email,
        noti_email: noti_email,
        noti_whatsapp: noti_whatsapp
    }

    try{
      await axios.put(`${import.meta.env.VITE_API_URL}/fornecedor/editar-fornecedor/${fornecedor.id}`, fornecedorEditado, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const novaLista = listaFornecedores.map(f => f.id === fornecedor.id ? { ...f, ...fornecedorEditado } : f);
      
      setListaFornecedores(novaLista);
      fecharModalEditar();

      } catch (error) {
        console.error("Erro editar fornecedor:", error);  
        setAlerta(alertaMensagem("Erro editar fornecedor", "error", <ReportProblemIcon/>));
      
         if(axios.isAxiosError(error) && error.response){
          console.error("Erro na API:", error);
          setAlerta(alertaMensagem(`Erro na API: ${error.response.data || error.message}`, 'warning', <ReportProblemIcon/>));
          return;
         } else {
           console.error("Erro editar fornecedor:", error);
           setAlerta(alertaMensagem(`Ocorreu um erro ao editar fornecedor. Tente novamente. ${error}`, 'error', <ReportProblemIcon />));
           return;
         }
      }    


  }
  
  const excluirFornecedor = async (fornecedor: iFornecedor) => {

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      alert('Token não encontrado');
      return;
    }

    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/fornecedor/excluir-fornecedor/${fornecedor.id}`, {
        headers: { Authorization: `Bearer ${token}`}
      });

      setListaFornecedores(listaFornecedores.filter(f => f.id !== fornecedor.id));

    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message ??
        error?.message ??
        'Erro desconhecido ao excluir fornecedor.';
        setAlerta(alertaMensagem(mensagem,'warning', <ReportProblemIcon/>));
    }   

  }

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
 
  return (
    <div className='bg-[#EAEFEF] mt-2 overflow-auto text-sm max-h-40'>

      {/* Cabeçalho — visível apenas em sm+ */}
      <div className="hidden sm:grid sm:grid-cols-6 items-center p-2 border-b text-center font-semibold bg-[#d4d9d9] sticky top-0">
        <div>Razão Social</div>
        <div>Celular</div>
        <div>Email</div>
        <div>Noti Whats</div>
        <div>Noti Email</div>
        <div>Ação</div>
      </div>

      {listaFornecedores.map((fornecedor) => (
        <div key={fornecedor.id} className="border-b last:border-b-0">

          {/* Layout mobile: card empilhado */}
          <div className="sm:hidden flex flex-col gap-1 p-2">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-gray-800 break-words max-w-[65%]">
                {fornecedor.nome}
              </span>
              <div className="flex gap-0 shrink-0">
                <Button size="small" onClick={() => abrirModalEditar(fornecedor)} sx={{ minWidth: 32, p: 0.5 }}>
                  <EditIcon fontSize="small" />
                </Button>
                <Button size="small" onClick={() => handleAbrirDialog(fornecedor)} sx={{ minWidth: 32, p: 0.5 }}>
                  <PersonRemoveIcon fontSize="small" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-600">{fornecedor.whatsApp || '—'}</div>
            <div className="text-xs text-gray-600 break-all">{fornecedor.email || '—'}</div>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>Noti Whats: <strong>{fornecedor.noti_whatsapp ? 'Sim' : 'Não'}</strong></span>
              <span>Noti Email: <strong>{fornecedor.noti_email ? 'Sim' : 'Não'}</strong></span>
            </div>
          </div>

          {/* Layout desktop: linha de tabela */}
          <div className="hidden sm:grid sm:grid-cols-6 items-center p-2 text-center">
            <div className="truncate px-1" title={fornecedor.nome}>{fornecedor.nome}</div>
            <div className="truncate px-1">{fornecedor.whatsApp || '—'}</div>
            <div className="truncate px-1 text-xs" title={fornecedor.email}>{fornecedor.email || '—'}</div>
            <div>{fornecedor.noti_whatsapp ? 'Sim' : 'Não'}</div>
            <div>{fornecedor.noti_email ? 'Sim' : 'Não'}</div>
            <div className="flex justify-center">
              <Button onClick={() => abrirModalEditar(fornecedor)} sx={{ minWidth: 32, p: 0.5 }}>
                <EditIcon fontSize="small" />
              </Button>
              <Button onClick={() => handleAbrirDialog(fornecedor)} sx={{ minWidth: 32, p: 0.5 }}>
                <PersonRemoveIcon fontSize="small" />
              </Button>
            </div>
          </div>

        </div>
      ))}
      
      <Dialog
        open={abrir}
        onClose={handleFecharDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este fornecedor? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{
            backgroundColor: "#f44336",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#d32f2f",
            },}}  
            onClick={handleFecharDialog} color="error" autoFocus>Cancelar</Button>
          <Button sx={{
            backgroundColor: "#f7931e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "20px",
            border: "2px solid #fff",
            paddingX: 3,
            "&:hover": {
              backgroundColor: "#e67e00",
            },}} 
            onClick={() => {if (fornecedorSelecionado) {excluirFornecedor(fornecedorSelecionado)} handleFecharDialog();}}>Excluir</Button>     
        </DialogActions>
      </Dialog>

      <Modal
              open={modalAberto}
              onClose={(reason) => {
                if (reason === 'backdropClick') return;
                fecharModalEditar();
              }}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box sx={estiloModal}>
              <Typography variant="h6" gutterBottom>
                Edição do fornecedor: {fornecedorSelecionado ? fornecedorSelecionado.nome : ""}
              </Typography>
      
              <Stack direction={"column"}  justifyContent="center" alignItems="start" spacing={1}>
                <TextField
                  label="Razão Social"
                  type="text"
                  fullWidth
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}> 
                  <TextField
                    label="Telefone"
                    type="text"
                    fullWidth
                    value={telefone}
                    placeholder='(99) 9999-9999'
                    onChange={(e) => inputTelefone(e.target.value)}
                    onBlur={verificaTel}
                    error={errorTel} 
                    helperText={errorTel ? "Número inválido" : ""}
                  />
                  <TextField
                    label="Celular"
                    type="text"
                    fullWidth
                    value={celular}
                    placeholder='(99) 99999-9999'
                    onChange={(e) => inputCelular(e.target.value)}
                    onBlur={verificaCel} 
                    error={errorCel} 
                    helperText={errorCel ? "Número inválido" : ""}

                  />  
                </Stack>
                 <TextField 
                  label="Email"
                  type='email'
                  fullWidth
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  onBlur={verificaEmail} 
                  error={errorEmail}
                  helperText={errorEmail ? "Email inválido" : ""}>
                 </TextField>

                 <FormGroup>
                    <FormControlLabel control={<input type="checkbox" disabled={true} checked={noti_whatsapp} onChange={(e) => setNoti_whatsapp(e.target.checked)} />} label="Notificação por WhatsApp" />
                    <FormControlLabel control={<input type="checkbox" checked={noti_email} onChange={(e) => setNoti_email(e.target.checked)} />} label="Notificação por Email" />
                 </FormGroup>
                          
                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    onClick={fecharModalEditar}
                    sx={{ backgroundColor: "#f44336", color: "#fff", fontWeight: "bold", borderRadius: "20px", border: "2px solid #fff", paddingX: 3, "&:hover": { backgroundColor: "#d32f2f" } }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={!nome}
                    variant="contained"
                    onClick={() => salvarEdicao(fornecedorSelecionado!)}
                    sx={{ backgroundColor: "#f7931e", color: "#fff", fontWeight: "bold", borderRadius: "20px", border: "2px solid #fff", paddingX: 3, "&:hover": { backgroundColor: "#e67e00" } }}
                  >
                    Salvar
                  </Button>
                </Stack>
              </Stack>

            {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}


            </Box>
      </Modal>

    </div>
  )
}

export default ListaFornecedor
