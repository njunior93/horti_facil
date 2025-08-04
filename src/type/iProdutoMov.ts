import type { iProduto } from "./iProduto";

export interface iProdutoMov {
  produto: iProduto;
  qtdMov: number;
  tipoSaida?: string;
  tipoEntrada?: string;
  tipoMov: string;
  dataMov: Date; 
}