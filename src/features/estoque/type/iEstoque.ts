import type { iProduto } from "../../../shared/type/iProduto";

export interface iEstoque {
  data: string;
  listaProdutos : iProduto[];
  contQtdEstoque: number;
}