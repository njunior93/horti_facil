export interface iProduto{
  id: number;
  nome: string;
  tipo: 'horta' | 'fruta' | '';
  // id_produto_estoque?: string;
  estoque?: number;
  estoqueSuficiente?: boolean;
  vendaMensal?: number;
  vendaDiaria?: number;
  tempo?: number;
  lote?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  uniMedida?: string;
}