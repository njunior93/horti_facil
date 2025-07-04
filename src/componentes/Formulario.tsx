import {  Button, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, type SelectChangeEvent } from '@mui/material';
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
  const listaTipoProdutos = useContext(AppContext).listaTipoProdutos;
  const [categoria, setCategoria] = useState<string>('horta');
  const {listaProdutoEstoque , setListaProdutoEstoque} = useContext(AppContext);
  const [produtoNome, setProdutoNome] = useState<string>('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<iProduto>({} as iProduto);
  const [produtosSelecionados , setProdutosSelecionados] = useState<any[]>([]);
  const [mensagemErro, setMensagemErro] = useState(false); 

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
  

    if (!estoqueAtual || !vendaMensal || !loteReposicao || !tempoReposicao) {
      setMensagemErro(true)
      return;
    }

    const vendaDiaria = Math.round(Number(vendaMensal) / 30);
    const estoqueMinimo = Math.round(vendaDiaria * Number(tempoReposicao));
    const estoqueMaximo = Math.round(estoqueMinimo + Number(loteReposicao));

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
      alert(`Ocorreu um erro ao incluir o produto. Tente novamente. ${error}`);
    }
  }

  return (
    <>
      <FormControl className='formulario-estoque'>
        <div className='formulario-estoque-categorias'>
          <span className="formulario-estoque-categorias-label">Categoria</span>
          <RadioGroup row aria-label='Categoria' defaultValue='horta' name='formulario-estoque-categorias' onChange={selecaoCategoria}>
            <FormControlLabel value='horta' control={<Radio />} label="Hortaliças"/>
            <FormControlLabel value='fruta' control={<Radio />} label="Frutas"/>
          </RadioGroup>
        </div>
        
        <div className="formulario-estoque-inputs flex flex-row gap-4 justify-between">
          <Select labelId="formulario-estoque-inputs-produto-label" id="formulario-estoque-inputs-produto" label="Produto" value={produtoNome} onChange={selecaoProduto} displayEmpty>
            <MenuItem value="" disabled>
              Produto
            </MenuItem>
            {produtosSelecionados.map((p) => (
              <MenuItem key={p.id} value={p.nome}>
                {p.nome}
              </MenuItem>
            ))}
          </Select>
          
          <TextField id="formulario-estoque-inputs-atual" disabled={!produtoSelecionado.id} type='number' value={estoqueAtual}  onChange={(e) => setEstoqueAtual(e.target.value)}  label="Estoque Atual" variant="outlined"/>
          <TextField id="formulario-estoque-inputs-venda" disabled={!produtoSelecionado.id} type='number' value={vendaMensal} onChange={(e) => setVendaMensal(e.target.value)}  label="Venda Mensal" variant="outlined"/>
          <TextField id="formulario-estoque-inputs-lote" disabled={!produtoSelecionado.id}  type='number' value={loteReposicao} onChange={(e) => setLoteReposicao(e.target.value)} label="Lote de Reposiçao" variant="outlined"/>
          <TextField id="formulario-estoque-inputs-tempo" disabled={!produtoSelecionado.id} type='number' value= {tempoReposicao}  onChange={(e) => setTempoReposicao(e.target.value)} label="Tempo de Reposição" variant="outlined"/>
          <Button variant="contained" disabled={!produtoSelecionado.id} startIcon={<AddCircleIcon />} onClick={calcularEstoque} sx={{ backgroundColor: "#4ED7F1", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#6FE6FC",},}}>Adicionar</Button>
        </div>   
      </FormControl>
        
        {mensagemErro && setTimeout(() => setMensagemErro(false), 2000)}

        {mensagemErro && (
          <div className="fixed inset-0 flex items-center justify-center z-[1301] pointer-events-none font-size:1.5rem ">
            <div className="pointer-events-auto">
              {alertaMensagem('Preencha todos os campos', 'warning', <ReportProblemIcon/>)}           
            </div>
          </div>
          )}
    </>
  )
  
}

export default formulario