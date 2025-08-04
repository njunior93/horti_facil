import { createContext, useState, type ReactNode } from 'react';
import type { iProduto } from '../type/iProduto';
import type { iEstoque } from '../type/iEstoque';
import type { iProdutoMov } from '../type/iProdutoMov';


interface IContext {
  listaTipoProdutos: iProduto[];
  setlistaTipoProdutos: (produto: iProduto[]) => void;
  categoria: string;
  setCategoria: (categoria: string) => void;
  listaProdutoEstoque: iProduto[];
  setListaProdutoEstoque: (item: iProduto[]) => void;
  contQtdEstoque: number;
  setContQtdEstoque: (cont: number) => void;
  contSuficiente: number;
  setContSuficiente: (cont: number) => void;
  contInsuficiente: number;
  setContInsuficiente: (cont: number) => void;
  estoqueSalvo: iEstoque;
  setEstoqueSalvo: (estoque: iEstoque) => void;
  listaProdutoMovTemp: iProdutoMov[];
  setListaProdutoMovTemp: (item: iProdutoMov[]) => void;
  listaProdutoMov: iProdutoMov[];
  setListaProdutoMov: (item: iProdutoMov[]) => void;
  tipoModal: string;
  setTipoModal: (mov: string) => void;
  handleModal: boolean;
  setHandleModal: (handle: boolean) => void;
  listaHistoricoMovEstoque: iProdutoMov[];
  setListaHistoricoMovEstoque: (item: iProdutoMov[]) => void;
  listaTipoMovimentacoes: string[];
  setListaTipoMovimentacoes: (mov: string[]) => void;
  listaMovimentacoesEstoque: string[];
  setListaMovimentacoesEstoque: (mov: string[]) => void;
  tipoMovSelecionado: string;
  setTipoMovSelecionado: (mov: string) => void;
  movimentacaoSelecionada: string;
  setMovimentacaoSelecionada: (mov: string) => void;
  tipoEntrada: string;
  setTipoEntrada: (tipo: string) => void;
  tipoSaida: string;
  setTipoSaida: (tipo: string) => void;
  mostrarCaixaDialogo: boolean;
  setMostrarCaixaDialogo: (mostrar: boolean) => void;

}

interface AppProvideProps{
    children: ReactNode
}

const inicial: IContext = {listaProdutoEstoque: [], setListaProdutoEstoque: () => {}, categoria: '', setCategoria: () => {}, listaTipoProdutos: [], setlistaTipoProdutos: () => {}, contSuficiente: 0, setContSuficiente: () => {}, contInsuficiente: 0, setContInsuficiente: () => {}, contQtdEstoque: 0, setContQtdEstoque: () => {} , estoqueSalvo: {} as iEstoque, setEstoqueSalvo: () => {}, listaProdutoMovTemp: [], setListaProdutoMovTemp: () => {}, tipoModal: "", setTipoModal: () => {}, handleModal: false, setHandleModal: () => {}, listaHistoricoMovEstoque: [], setListaHistoricoMovEstoque: () => {}, listaTipoMovimentacoes: [], setListaTipoMovimentacoes: () => {}, listaMovimentacoesEstoque: [], setListaMovimentacoesEstoque: () => {}, tipoMovSelecionado: '', setTipoMovSelecionado: () => {}, movimentacaoSelecionada: '', setMovimentacaoSelecionada: () => {}, tipoEntrada: '', setTipoEntrada: () => {}, tipoSaida: '', setTipoSaida: () => {}, listaProdutoMov: [], setListaProdutoMov: () => {}, mostrarCaixaDialogo: false, setMostrarCaixaDialogo: () => {} };

export const AppContext = createContext<IContext>(inicial);

export const unidadesMedida = [
  "Quilo",
  "Unidade",
  "Dúzia",
  "Cento",
  "Maço",
  "Litro",
  "Pacote",
  "Saca",
  "Bandeja"
];

const frutas: iProduto[] = [
  { id: 1, nome: "Maçã", tipo: "fruta" },
  { id: 2, nome: "Banana", tipo: "fruta" },
  { id: 3, nome: "Laranja", tipo: "fruta" },
  { id: 4, nome: "Uva", tipo: "fruta" },
  { id: 5, nome: "Mamão", tipo: "fruta" },
  { id: 6, nome: "Abacaxi", tipo: "fruta" },
  { id: 7, nome: "Manga", tipo: "fruta" },
  { id: 8, nome: "Melancia", tipo: "fruta" },
];

const hortalicas: iProduto[] = [
  { id: 9, nome: "Alface", tipo: "horta" },
  { id: 10, nome: "Cenoura", tipo: "horta" },
  { id: 11, nome: "Tomate", tipo: "horta" },
  { id: 12, nome: "Cebola", tipo: "horta" },
  { id: 13, nome: "Batata", tipo: "horta" },
  { id: 14, nome: "Brócolis", tipo: "horta" },
  { id: 15, nome: "Espinafre", tipo: "horta" },
  { id: 16, nome: "Repolho", tipo: "horta" },
];

const tipoMovimentacoes: string[] = [
  "Todos os tipos",
  "Entrada",
  "Saída"
];

export const movimentacoesEstoque: string[] = [
  "Todas as movimentações",
  "Entrada Manual",
  "Entrada Pedido",
  "Saída Manual - AVARIA",
  'Saída Manual - VENDA',
]

const produtos: iProduto[] = [...frutas, ...hortalicas];

export const AppProvider = ({ children }: AppProvideProps) => {
  const [listaTipoProdutos, setlistaTipoProdutos] = useState<iProduto[]>(produtos);
  const [categoria, setCategoria] = useState<string>('');
  const [listaProdutoEstoque, setListaProdutoEstoque] = useState<iProduto[]>([]);
  const [contQtdEstoque, setContQtdEstoque] = useState<number>(0);
  const [contSuficiente, setContSuficiente] = useState<number>(0);
  const [contInsuficiente, setContInsuficiente] = useState<number>(0);
  const [estoqueSalvo, setEstoqueSalvo] = useState<iEstoque>({} as iEstoque);
  const [listaProdutoMovTemp, setListaProdutoMovTemp] = useState<iProdutoMov[]>([])
  const [tipoModal, setTipoModal] = useState<string>('')
  const [handleModal, setHandleModal] = useState<boolean>(false)
  const [listaHistoricoMovEstoque, setListaHistoricoMovEstoque] = useState<iProdutoMov[]>([]);
  const [listaTipoMovimentacoes, setListaTipoMovimentacoes] = useState<string[]>(tipoMovimentacoes);
  const [listaMovimentacoesEstoque, setListaMovimentacoesEstoque] = useState<string[]>(movimentacoesEstoque);
  const [tipoMovSelecionado, setTipoMovSelecionado] = useState('');
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState('');
  const [tipoEntrada, setTipoEntrada] = useState<string>('');
  const [tipoSaida, setTipoSaida] = useState<string>('')
  const [listaProdutoMov, setListaProdutoMov] = useState<iProdutoMov[]>([]);
  const [mostrarCaixaDialogo, setMostrarCaixaDialogo] = useState(false);

  


  return (
    <AppContext.Provider value={{handleModal, setHandleModal, listaProdutoMovTemp,setListaProdutoMovTemp,listaTipoProdutos, setlistaTipoProdutos, categoria, setCategoria, listaProdutoEstoque, setListaProdutoEstoque, contSuficiente, setContSuficiente, contInsuficiente, setContInsuficiente, contQtdEstoque, setContQtdEstoque, estoqueSalvo, setEstoqueSalvo, tipoModal, setTipoModal, listaHistoricoMovEstoque, setListaHistoricoMovEstoque, listaTipoMovimentacoes, setListaTipoMovimentacoes, listaMovimentacoesEstoque, setListaMovimentacoesEstoque, tipoMovSelecionado, setTipoMovSelecionado, movimentacaoSelecionada, setMovimentacaoSelecionada, tipoEntrada, setTipoEntrada, tipoSaida, setTipoSaida, listaProdutoMov, setListaProdutoMov, mostrarCaixaDialogo, setMostrarCaixaDialogo}}>
      {children}
    </AppContext.Provider>
  );
};