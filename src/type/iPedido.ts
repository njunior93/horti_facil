export interface iPedido{
  id: number;
  status: string;
  data: string;
  fornecedor: {
    nome: string;
  }
}