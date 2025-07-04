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
  listaProdutoMov: iProdutoMov[];
  setListaProdutoMov: (item: iProdutoMov[]) => void;
  tipoModal: string;
  setTipoModal: (mov: string) => void;
  handleModal: boolean;
  setHandleModal: (handle: boolean) => void;
  listaHistoricoMovEstoque?: iProdutoMov[];
  setListaHistoricoMovEstoque?: (item: iProdutoMov[]) => void;

}

interface AppProvideProps{
    children: ReactNode
}

const inicial: IContext = {listaProdutoEstoque: [], setListaProdutoEstoque: () => {}, categoria: '', setCategoria: () => {}, listaTipoProdutos: [], setlistaTipoProdutos: () => {}, contSuficiente: 0, setContSuficiente: () => {}, contInsuficiente: 0, setContInsuficiente: () => {}, contQtdEstoque: 0, setContQtdEstoque: () => {} , estoqueSalvo: {} as iEstoque, setEstoqueSalvo: () => {}, listaProdutoMov: [], setListaProdutoMov: () => {}, tipoModal: "", setTipoModal: () => {}, handleModal: false, setHandleModal: () => {}, listaHistoricoMovEstoque: [], setListaHistoricoMovEstoque: () => {}};

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

const produtos: iProduto[] = [...frutas, ...hortalicas];

export const AppProvider = ({ children }: AppProvideProps) => {
  const [listaTipoProdutos, setlistaTipoProdutos] = useState<iProduto[]>(produtos);
  const [categoria, setCategoria] = useState<string>('');
  const [listaProdutoEstoque, setListaProdutoEstoque] = useState<iProduto[]>([]);
  const [contQtdEstoque, setContQtdEstoque] = useState<number>(0);
  const [contSuficiente, setContSuficiente] = useState<number>(0);
  const [contInsuficiente, setContInsuficiente] = useState<number>(0);
  const [estoqueSalvo, setEstoqueSalvo] = useState<iEstoque>({} as iEstoque);
  const [listaProdutoMov, setListaProdutoMov] = useState<iProdutoMov[]>([])
  const [tipoModal, setTipoModal] = useState<string>('')
  const [handleModal, setHandleModal] = useState<boolean>(false)
  const [listaHistoricoMovEstoque, setListaHistoricoMovEstoque] = useState<iProdutoMov[]>([]);


  return (
    <AppContext.Provider value={{handleModal, setHandleModal, listaProdutoMov,setListaProdutoMov,listaTipoProdutos, setlistaTipoProdutos, categoria, setCategoria, listaProdutoEstoque, setListaProdutoEstoque, contSuficiente, setContSuficiente, contInsuficiente, setContInsuficiente, contQtdEstoque, setContQtdEstoque, estoqueSalvo, setEstoqueSalvo, tipoModal, setTipoModal, listaHistoricoMovEstoque, setListaHistoricoMovEstoque }}>
      {children}
    </AppContext.Provider>
  );
};