import React from 'react';
import { useContext,  useState } from 'react'
import { AppContext } from '../context/context';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import type { iProduto } from '../type/iProduto';
import { unidadesMedida } from '../context/context';


function ListaProdutos() {

  const {listaProdutoEstoque, setListaProdutoEstoque}  = useContext(AppContext);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionadoEdicao, setProdutoSelecionadoEdicao] = useState<iProduto>({} as iProduto);
  const [estoqueMinimo, setEstoqueMinimo] = useState<number>(0);
  const [estoqueMaximo, setEstoqueMaximo] = useState<number>(0);
  const [estoqueAtual, setEstoqueAtual] = useState<number>(0);
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
    // if (!window.confirm(`Deseja realmente excluir o produto ${produto.nome}?`)) {
    //   return;
    // }
    const id_localizado = listaProdutoEstoque.find(p => p.id_produto_estoque === produto.id_produto_estoque);

    if(id_localizado !== undefined) {
      const novaLista = listaProdutoEstoque.filter((p) => p.id_produto_estoque !== produto.id_produto_estoque);
      setListaProdutoEstoque(novaLista);
    }
  }
  
  return (
    <div className='w-full h-5/8 bg-white rounded-lg shadow-md p-1 mt-4 text-center overflow-auto text-sm sm:text-base sm:p-4'>
      <div className='grid grid-cols-6 divide-x-3 divide-dashed'>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Produto</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Unidade</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Estoque</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Mínimo</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Máximo</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Ação</div>
      </div>

      {listaProdutoEstoque.length === 0 && (
        <div className='text-center text-gray-500 mt-4'>Nenhum produto cadastrado no estoque</div>   
      )}

      {listaProdutoEstoque.map((p) => (
        <div key={p.id} className={`flex justify-center items-center grid grid-cols-6 gap-x-px mt-0 border-b-2 border-gray-200 pb-3 text-center ${
          (p.estoqueSuficiente === false) ?  'bg-[#EA2F14] text-white' : 'bg-[#00DA63]'
        } `}>
          <div className='col-span-1 flex justify-center items-center h-9'>{p.nome}</div>
          <div className='col-span-1 flex justify-center items-center h-9 m-1'>         
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
                    }}
                  >
                    {selected ? abreviacoes[selected] || selected : 'Selecione'}

                  </Box>
                )}
                  sx={{
                        fontSize: {
                      xs: "0.75rem",
                      sm: "1rem",
                    },
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
                      marginLeft: 1,
                    },
                  }}
                onChange={(e) => selecionandoUnidade(p, e.target.value)}
                labelId="tipo-unidade"
                label="Selecione"
                displayEmpty
                
              > 
                {unidadesMedida.map((uniMedida, index) => (
                  <MenuItem key={index} value={uniMedida}>{uniMedida}</MenuItem>
                ))}
              </Select>
          </div>
          <div className='col-span-1 flex justify-center items-center h-9 '>{p.estoque}</div>
          <div className='col-span-1 flex justify-center items-center h-9'>{p.estoqueMinimo}</div>
          <div className='col-span-1 flex justify-center items-center h-9'>{p.estoqueMaximo}</div>
          <div className='col-span-1 flex justify-center items-center h-9 p-1 gap-x-1'>
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
    </div>
  )
}

export default ListaProdutos