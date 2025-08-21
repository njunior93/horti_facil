import type { iProduto } from "./iProduto";

export interface iEstoque {
  data: string;
  listaProdutos : iProduto[];
  contQtdEstoque: number;
}