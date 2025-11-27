export interface iPedido{
  id: number;
  status: string;
  data_criacao: string;
  data_efetivacao?: string
  fornecedor: {
    nome: string;
  }
  itens: {
    produto_id: number;
    qtd_solicitado: number;
    qtd_recebido: number;
    produto: {
      id: number;
      nome: string;
      uniMedida: string;
      estoqueMinimo: number;
    };
  }[];
  
}