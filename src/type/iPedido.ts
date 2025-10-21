export interface iPedido{
  id: number;
  status: string;
  data: string;
  fornecedor: {
    nome: string;
  }
  itens: {
    produto_id: number;
    quantidade: number;
    produto: {
      id: number;
      nome: string;
      uniMedida: string;
      estoqueMinimo: number;
    };
  }[];
  
}