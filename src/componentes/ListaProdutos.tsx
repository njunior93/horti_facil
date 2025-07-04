import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import type { iProduto } from '../type/iProduto';
import { unidadesMedida } from '../context/context';


function ListaProdutos() {

  const {listaProdutoEstoque, setListaProdutoEstoque}  = useContext(AppContext);
  const [modalAberto, setModalAberto] = useState(false);
  const [unidadeAberta, setUnidadeAberta] = useState(false);
  const [produtoSelecionadoEdicao, setProdutoSelecionadoEdicao] = useState<iProduto>({} as iProduto);
  const [estoqueMinimo, setEstoqueMinimo] = useState<number>(0);
  const [estoqueMaximo, setEstoqueMaximo] = useState<number>(0);
  const [estoqueAtual, setEstoqueAtual] = useState<number>(0);
  const [unidade, setUnidade] = useState("");
  // const {contSuficiente, setContSuficiente} = useContext(AppContext);
  // const {contInsuficiente, setContInsuficiente} = useContext(AppContext);
  // const {contQtdEstoque, setContQtdEstoque} = useContext(AppContext);

  // useEffect(() => {
  //   let Suficiente = 0;
  //   let Insuficiente = 0;

  //   listaProdutoEstoque.forEach((produto) => {
  //     if ((produto.estoque ?? 0) >= (produto.estoqueMinimo ?? 0)) {
  //       Suficiente++;
  //     } else {
  //       Insuficiente++;
  //     }
  //   });

  //   setContSuficiente(Suficiente);
  //   setContInsuficiente(Insuficiente);
  //   setContQtdEstoque(listaProdutoEstoque.length);

  // },[contQtdEstoque, contSuficiente, contInsuficiente, listaProdutoEstoque]);

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
      const produto_localizado = listaProdutoEstoque.find(p => p.id_produto_estoque === produto.id_produto_estoque);
      
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
      alert('Os valores não podem ser negativos.');
      return;
    }
    if (estoqueMinimo >= estoqueMaximo) {
      alert('O estoque mínimo deve ser menor que o estoque máximo.');
      return;
    }
    if (estoqueAtual < estoqueMinimo || estoqueAtual > estoqueMaximo) {
      alert('O estoque atual deve estar entre o estoque mínimo e máximo.');
      return;
    }
    

    const index = listaProdutoEstoque.findIndex(p => p.id_produto_estoque === produto.id_produto_estoque);
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
    const index = listaProdutoEstoque.findIndex(p => p.id_produto_estoque === produto.id_produto_estoque);
    if (index !== -1) {
      listaProdutoEstoque.splice(index, 1);
      setListaProdutoEstoque([...listaProdutoEstoque]);
    }
  }
  
  return (
    <div className='lista-produtos-estoque w-full h-5/8 bg-white rounded-lg shadow-md p-4 mt-4 text-center overflow-auto'>
      <div className='grid grid-cols-6 '>
        <div className='col-span-1 font-bold border-2 border-solid'>Produto</div>
        <div className='col-span-1 font-bold border-2 border-solid'>Unidade de Medida</div>
        <div className='col-span-1 font-bold border-2 border-solid'>Estoque Atual</div>
        <div className='col-span-1 font-bold border-2 border-solid'>Estoque Mínimo</div>
        <div className='col-span-1 font-bold border-2 border-solid'>Estoque Máximo</div>
        <div className='col-span-1 font-bold border-2 border-solid'>Ação</div>
      </div>

      {listaProdutoEstoque.length === 0 && (
        <div className='text-center text-gray-500 mt-4'>Nenhum produto cadastrado no estoque</div>   
      )}

      {listaProdutoEstoque.map((p) => (
        <div key={p.id} className={`grid grid-cols-6 gap-x-px mt-0 border-b-2 border-gray-200 pb-3 text-center ${
          (p.estoqueSuficiente === false) ?  'bg-[#EA2F14] text-white' : 'bg-[#00DA63]'
        } `}>
          <div className='col-span-1 flex justify-center items-center h-9'>{p.nome}</div>
          <div className='col-span-1 flex justify-center items-center h-9 m-1'>         
              <Select
                id="demo-simple-select"
                value={p.uniMedida}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <em>Selecione</em>;
                  }

                   return selected;
                  }}
                  sx={{
                      backgroundColor: "white",
                      height: "100%",
                      width: "100%",
                      padding: "0 8px",
                      fontStyle: p.uniMedida ? "normal" : "italic",
                      borderRadius: 0,
                }}
                onChange={(e) => selecionandoUnidade(p, e.target.value)}
                displayEmpty
                
              >
                <MenuItem value="" disabled>
                  Selecione
                </MenuItem> 
                {unidadesMedida.map((uniMedida, index) => (
                  <MenuItem key={index} value={uniMedida}>{uniMedida}</MenuItem>
                ))}
              </Select>
          </div>
          <div className='col-span-1 flex justify-center items-center h-9 '>{p.estoque}</div>
          <div className='col-span-1 flex justify-center items-center h-9'>{p.estoqueMinimo}</div>
          <div className='col-span-1 flex justify-center items-center h-9'>{p.estoqueMaximo}</div>
          <div className='col-span-1 flex justify-center items-center h-9 gap-x-2'>
            <Button onClick={() => abrirModalEditar(p)}  variant="contained" color="primary" size='small'  startIcon={<EditIcon />}></Button>
            <Button onClick={() => deletarProduto(p)}  variant="contained" color="error" size='small' startIcon={<DeleteIcon />}></Button>
          </div>
        </div>
      ))} 

      <Modal
        open={modalAberto}
        onClose={(e, reason) => {
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
    </div>
  )
}

export default ListaProdutos