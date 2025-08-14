import {  Box, Button, Divider, FormControl, FormControlLabel, FormHelperText, MenuItem, Radio, RadioGroup, Select, Stack, Switch, TextField, Typography, type SelectChangeEvent } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AppContext } from '../context/context';
import type { iProduto } from '../type/iProduto';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import  alertaMensagem  from '../utils/alertaMensagem';

const formulario = () => {
  const [estoqueAtual, setEstoqueAtual] = useState('');
  const [vendaMensal, setVendaMensal] = useState('');
  const [loteReposicao, setLoteReposicao] = useState('');
  const [tempoReposicao, setTempoReposicao] = useState('');
  const [estoqueMinimoInput, setEstoqueMinimoInput] = useState('');
  const [estoqueMaximoInput, setEstoqueMaximoInput] = useState('');
  const listaTipoProdutos = useContext(AppContext).listaTipoProdutos;
  const [categoria, setCategoria] = useState<string>('horta');
  const {listaProdutoEstoque , setListaProdutoEstoque} = useContext(AppContext);
  const [produtoNome, setProdutoNome] = useState<string>('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<iProduto>({} as iProduto);
  const [produtosSelecionados , setProdutosSelecionados] = useState<any[]>([]);
  const [alertaAddProduto, setAlertaAddProduto] = useState<React.ReactNode | null>(null);
  const {tipoInput, setTipoInput} = useContext(AppContext);

  
  setTimeout(() =>{
    if(alertaAddProduto){
      setAlertaAddProduto(null)
    }
  },4000);

  useEffect(() => {
    if (categoria === 'horta') {
      setProdutosSelecionados(listaTipoProdutos.filter((produto) => produto.tipo === 'horta'));
    } else if (categoria === 'fruta') {
      setProdutosSelecionados(listaTipoProdutos.filter((produto) => produto.tipo === 'fruta'));
    }

  }, [categoria]);

  const limparCamposInput = () => {
    setEstoqueAtual('');
    setVendaMensal('');
    setLoteReposicao('');
    setTempoReposicao('');
    setEstoqueMinimoInput('');
    setEstoqueMaximoInput('');
  }

  const selecaoProduto = (e: SelectChangeEvent) => {
    const produtoSelecionado = listaTipoProdutos.find((p) => p.nome === e.target.value);
    if (produtoSelecionado ) {
      setProdutoSelecionado(produtoSelecionado);
      setProdutoNome(produtoSelecionado.nome);
    } else {
      setProdutoSelecionado({} as iProduto);
      limparCamposInput();
    }
  };

  const selecaoCategoria = (e: SelectChangeEvent) =>{
    setCategoria(e.target.value);
    setProdutosSelecionados([]);
    setProdutoNome('')
    setProdutoSelecionado({} as iProduto);
    limparCamposInput();
  }

  const calcularEstoque = () => {
  
    const produtoJaExiste = listaProdutoEstoque.some(
      (produto) => produto.id === produtoSelecionado.id
    );

    if (tipoInput === 'auto') {
      if (Number(estoqueAtual) < 0 || Number(vendaMensal) < 0 || Number(loteReposicao) < 0 || Number(tempoReposicao) < 0) {
        setAlertaAddProduto(alertaMensagem('Há valores negativos.', 'warning', <ReportProblemIcon/>));
        return;
      }

      if (produtoJaExiste) {
        setAlertaAddProduto(alertaMensagem("Produto ja adicionado!", "warning", <ReportProblemIcon/>));
        return;
      }

      if (!estoqueAtual || !vendaMensal || !loteReposicao || !tempoReposicao) {
        setAlertaAddProduto(alertaMensagem('Preencha todos os campos', 'warning', <ReportProblemIcon/>));
        return;
      }
    }

    if (tipoInput === 'manual') {

      if (produtoJaExiste) {
        setAlertaAddProduto(alertaMensagem("Produto ja adicionado!", "warning", <ReportProblemIcon/>));
        return;
      }

      if (!estoqueMinimoInput || !estoqueMaximoInput) {
        setAlertaAddProduto(alertaMensagem('Preencha todos os campos', 'warning', <ReportProblemIcon />));
        return;
      }
    }

    const vendaDiaria = Math.round(Number(vendaMensal) / 30);
    const estoqueMinimo =  tipoInput === 'auto' ? Math.round(vendaDiaria * Number(tempoReposicao)) : Math.round(Number(estoqueMinimoInput));
    const estoqueMaximo =  tipoInput === 'auto' ? Math.round(estoqueMinimo + Number(loteReposicao)) : Math.round(Number(estoqueMaximoInput));    

    try{
      if (produtoSelecionado && produtoSelecionado.id && produtoSelecionado.nome && produtoSelecionado.tipo) {
      setListaProdutoEstoque([
        ...listaProdutoEstoque,
        {
        ...produtoSelecionado,
        id_produto_estoque: Math.random().toString(36).substring(2, 10),
        estoque: Number(estoqueAtual),
        vendaMensal: Number(vendaMensal),
        vendaDiaria: Number(Math.round(vendaDiaria)),
        tempo: Number(tempoReposicao),
        lote: Number(loteReposicao),
        estoqueMinimo: Math.round(estoqueMinimo),
        estoqueMaximo: Math.round(estoqueMaximo),
        estoqueSuficiente: Number(estoqueAtual) >= estoqueMinimo ? true : false
        }
      ]);
      setProdutoSelecionado({} as iProduto);
      setProdutoNome('');
      limparCamposInput();
    } else {
      return;
    }

    } catch (error){
      setAlertaAddProduto(alertaMensagem(`Ocorreu um erro ao incluir o produto. Tente novamente ${error} `, "warning", <ReportProblemIcon/>));
    }
  }

  const alterarTipoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoInput(event.target.checked ? 'auto' : 'manual');
    limparCamposInput();
  }

  return (
    <div>
      <FormControl className='w-full sm:w-5xl'>
        <div className='flex flex-row justify-between items-center mb-4 mt-2'>
          <Stack direction="column" spacing={0}>
            <span className="mt-2">Categoria</span>
            <RadioGroup  row aria-label='Categoria' defaultValue='horta' name='formulario-estoque-categorias' onChange={selecaoCategoria}>
              <FormControlLabel value='horta' control={<Radio />} label="Hortaliças"/>
              <FormControlLabel value='fruta' control={<Radio />} label="Frutas"/>
            </RadioGroup>
          </Stack>

          <Stack direction="column" spacing={0} sx={{ alignItems: 'center' }}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%' }}>
              <Typography sx={{ fontWeight: 'bold', bgcolor: '#e3f2fd', px: 1, py: 0.5, borderRadius: 1, fontSize: {xs: '0.75rem'} }}>
               Mínimo e Máximo:
              </Typography>
            </Box>
            
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%' }}>
              <Typography>Manual</Typography>
              <Switch checked={tipoInput === 'auto'} onChange={alterarTipoInput} defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
              <Typography>Auto</Typography>
            </Box>
         
          </Stack>
        </div>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} divider={<Divider orientation='vertical' flexItem/>}>
          <Select labelId="formulario-estoque-inputs-produto-label" id="formulario-estoque-inputs-produto" label="Produto" value={produtoNome} onChange={selecaoProduto} displayEmpty sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <MenuItem value="" disabled>
              Produto
            </MenuItem>
            {produtosSelecionados.map((p) => (
              <MenuItem key={p.id} value={p.nome}>
                {p.nome}
              </MenuItem>
            ))}
          </Select>

          {tipoInput === 'auto' ? (
            <>
              <TextField required id="formulario-estoque-inputs-atual" disabled={!produtoSelecionado.id} type='number' value={estoqueAtual}  onChange={(e) => setEstoqueAtual(e.target.value)}  label="Estoque Atual" variant="outlined" error={Number(estoqueAtual) < 0}/>
              <TextField required id="formulario-estoque-inputs-venda" disabled={!produtoSelecionado.id} type='number' value={vendaMensal} onChange={(e) => setVendaMensal(e.target.value)}  label="Venda Mensal" variant="outlined" error={Number(vendaMensal) < 0}/>
              <TextField required id="formulario-estoque-inputs-lote" disabled={!produtoSelecionado.id}  type='number' value={loteReposicao} onChange={(e) => setLoteReposicao(e.target.value)} label="Lote de Repos." variant="outlined" error={Number(loteReposicao) < 0}/>
              <TextField required id="formulario-estoque-inputs-tempo" disabled={!produtoSelecionado.id} type='number' value= {tempoReposicao}  onChange={(e) => setTempoReposicao(e.target.value)} label="Tempo de Repos." variant="outlined" error={Number(tempoReposicao) < 0}/>
            </>
          ) : (
            <>
              <TextField required id="formulario-estoque-inputs-atual" disabled={!produtoSelecionado.id} type='number' value={estoqueAtual}  onChange={(e) => setEstoqueAtual(e.target.value)}  label="Estoque Atual" variant="outlined" error={Number(estoqueAtual) < 0}/>
              <TextField required id="formulario-estoque-inputs-minimo" disabled={!produtoSelecionado.id} type='number' value={estoqueMinimoInput} onChange={(e) => setEstoqueMinimoInput(e.target.value)}  label="Estoque Mínimo" variant="outlined" error={Number(estoqueMinimoInput) < 0}/>
              <TextField required id="formulario-estoque-inputs-maximo" disabled={!produtoSelecionado.id} type='number' value={estoqueMaximoInput} onChange={(e) => setEstoqueMaximoInput(e.target.value)} label="Estoque Máximo" variant="outlined" error={Number(estoqueMaximoInput) < 0}/>
            </>
          )} 
          <Button variant="contained" disabled={!produtoSelecionado.id} startIcon={<AddCircleIcon />} onClick={calcularEstoque} sx={{ backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#6FE6FC",},}}>Adicionar</Button>
        </Stack>

        <FormHelperText>
          {Number(estoqueAtual) < 0 || Number(vendaMensal) < 0 || Number(loteReposicao) < 0 || Number(tempoReposicao) < 0 || Number(estoqueMinimoInput) < 0 || Number(estoqueMinimoInput) < 0?<span style={{ color: 'red' }}>Os valores não podem ser negativos.</span> : "" }
        </FormHelperText>
      </FormControl>

      <div className='grid grid-cols-6 divide-x-1 divide-dashed mt-4 text-sm sm:text-base'>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Produto</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Unidade</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Estoque</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Mínimo</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Máximo</div>
        <div className='col-span-1 font-bold flex items-center justify-center sm:border-2 border-solid'>Ação</div>
      </div>
        
      {alertaAddProduto && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alertaAddProduto}</Box>}
    </div>
  )
  
}

export default formulario