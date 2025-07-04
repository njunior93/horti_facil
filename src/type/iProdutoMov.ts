import type { iProduto } from "./iProduto";

export interface iProdutoMov {
  produto: iProduto;
  qtdMov: number;
  tipoSaida?: string;
  tipoMov: string;
  dataMov: Date; 
}