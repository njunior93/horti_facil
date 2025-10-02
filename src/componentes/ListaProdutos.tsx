import React from 'react';
import { useContext, useState } from 'react';
import { AppContext } from '../context/context';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Box, Button, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import type { iProduto } from '../type/iProduto';
import { unidadesMedida } from '../context/context';
import alertaMensagem from '../utils/alertaMensagem';

function ListaProdutos() {

  const {listaProdutoEstoque, setListaProdutoEstoque}  = useContext(AppContext);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionadoEdicao, setProdutoSelecionadoEdicao] = useState<iProduto>({} as iProduto);
  const [estoqueMinimo, setEstoqueMinimo] = useState<number>(0);
  const [estoqueMaximo, setEstoqueMaximo] = useState<number>(0);
  const [estoqueAtual, setEstoqueAtual] = useState<number>(0);
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const abreviacoes: Record<string, string> = {
  "Quilo": "Kg",
  "Unidade": "Un",
  "Dúzia": "Dz",
  "Cento": "Ct",
  "Maço": "Maç",
  "Litro": "L",
  "Pacote": "Pct",
  "Saca": "Sc",
  "Bandeja": "Bdj"
};

  setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);

  const estiloModal: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        padding: '24px',
  };

  const selecionandoUnidade = (produto: iProduto, novaUnidade: string) => {
      const produto_localizado = listaProdutoEstoque.find(p => p.id === produto.id);
      
      if (produto_localizado) {
        produto_localizado.uniMedida = novaUnidade;
        setListaProdutoEstoque([...listaProdutoEstoque]);
      }
  };

  const abrirModalEditar = (produto: iProduto) => {
    setModalAberto(true);
    setProdutoSelecionadoEdicao(produto);
  }

  const fecharModal = () => {
    setModalAberto(false);
  }

  const salvarEdicao = (produto: iProduto) => {
    if (estoqueMinimo < 0 || estoqueMaximo < 0 || estoqueAtual < 0) {
      setAlerta(alertaMensagem('Os valores não podem ser negativos.', 'warning', <ReportProblemIcon/>));
      return;
    }
    if (estoqueMinimo >= estoqueMaximo) {
      setAlerta(alertaMensagem('O estoque mínimo deve ser menor que o estoque máximo.', 'warning', <ReportProblemIcon/>));
      return;
    }
    if (estoqueAtual < estoqueMinimo || estoqueAtual > estoqueMaximo) {
      setAlerta(alertaMensagem('O estoque atual deve estar entre o estoque mínimo e máximo.', 'warning', <ReportProblemIcon/>));
      return;
    }
    

    const index = listaProdutoEstoque.findIndex(p => p.id === produto.id);
    if (index !== -1) {
      listaProdutoEstoque[index] = {
      ...listaProdutoEstoque[index],
      estoque: estoqueAtual,
      estoqueMinimo,
      estoqueMaximo,
      estoqueSuficiente: Number(estoqueAtual) >= estoqueMinimo ? true : false
      };
    }

    setEstoqueMinimo(0);
    setEstoqueMaximo(0);
    setEstoqueAtual(0);
    setListaProdutoEstoque([...listaProdutoEstoque]);
    setProdutoSelecionadoEdicao({} as iProduto);
    fecharModal();
  }

  const deletarProduto = (produto: iProduto) => {
    const id_localizado = listaProdutoEstoque.find(p => p.id === produto.id);

    if(id_localizado !== undefined) {
      const novaLista = listaProdutoEstoque.filter((p) => p.id !== produto.id);
      setListaProdutoEstoque(novaLista);
    }
  }
  
  return (
    <div className='h-28 sm:h-lvh sm:max-h-[200px] text-sm sm:text-base overflow-auto bg-[#FFF] p-1'>

      {listaProdutoEstoque.length === 0 && (
        <div className='text-center text-gray-500 mt-4'>Nenhum produto cadastrado no estoque</div>   
      )}

      {listaProdutoEstoque.map((p) => (
        <div key={p.id} className={`grid grid-cols-6 border-b-2 border-gray-200 text-center h-10 ${
          (p.estoqueSuficiente === false) ?  'bg-[#EA2F14] text-white' : 'bg-[#00DA63]'
        } `} style={{ marginBottom: '1px' }}>
          <div className='flex justify-center items-center'>{p.nome}</div>
          <div>         
              <Select
                id="demo-simple-select"
                value={p.uniMedida}
                IconComponent={() => null}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontStyle: !selected ? 'italic' : 'normal',
                      color: !selected ? '#aaa' : 'inherit',
                      marginLeft: 4,
                    }}
                  >
                    {selected ? abreviacoes[selected] || selected : 'Selecione'}

                  </Box>
                )}
                  sx={{
                    fontSize: { xs: "0.68rem",sm: "1rem"},
                    backgroundColor: "white",
                    height: "100%",
                    width: "100%",
                    padding: 0,
                    borderRadius: 0,
                    fontStyle: p.uniMedida ? "normal" : "italic",
                    textAlign: "center",
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      textAlign: "center",
                      height: "100%",
                      width: "100%",
                    },
                  }}
                onChange={(e) => selecionandoUnidade(p, e.target.value)}
                labelId="tipo-unidade"
                displayEmpty
                
              > 
                {unidadesMedida.map((uniMedida, index) => (
                  <MenuItem key={index} value={uniMedida}>{uniMedida}</MenuItem>
                ))}
              </Select>
          </div>
          <div className='flex justify-center items-center'>{p.estoque}</div>
          <div className='flex justify-center items-center'>{p.estoqueMinimo}</div>
          <div className='flex justify-center items-center'>{p.estoqueMaximo}</div>
          <div className='flex justify-center items-center gap-x-1 p-1'>
            <Button sx={{minWidth: { xs: '25px', sm: '64px' }, display: 'flex', alignItems: 'center',justifyContent: 'center'}} onClick={() => abrirModalEditar(p)}  variant="contained" color="primary" size='small' ><EditIcon fontSize="small" /></Button>
            <Button sx={{minWidth: { xs: '25px', sm: '64px' }, display: 'flex', alignItems: 'center',justifyContent: 'center'}} onClick={() => deletarProduto(p)}  variant="contained" color="error" size='small'><DeleteIcon fontSize="small" /></Button>
          </div>
        </div>
      ))} 

      <Modal
        open={modalAberto}
        onClose={(reason) => {
          if (reason === 'backdropClick') return;
          fecharModal();
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={estiloModal}>
        <Typography variant="h6" gutterBottom>
          Informe o novo estoque: {produtoSelecionadoEdicao.nome}
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Estoque Atual"
            type="number"
            fullWidth
            value={estoqueAtual}
            onChange={(e) => setEstoqueAtual(Number(e.target.value))}
          />
          <TextField
            label="Estoque Mínimo"
            type="number"
            fullWidth
            value={estoqueMinimo}
            onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
          />
          <TextField
            label="Estoque Máximo"
            type="number"
            fullWidth
            value={estoqueMaximo}
            onChange={(e) => setEstoqueMaximo(Number(e.target.value))}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={() => salvarEdicao(produtoSelecionadoEdicao)}>
              Salvar
            </Button>
          </Stack>
        </Stack>
      </Box>
      </Modal>   

      {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
        

    </div>
  )
}

export default ListaProdutos