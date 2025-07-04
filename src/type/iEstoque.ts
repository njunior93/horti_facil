import type { iProduto } from "./iProduto";

export interface iEstoque {
  id: string;
  data: string;
  listaProdutos : iProduto[];
  contQtdEstoque: number;
}