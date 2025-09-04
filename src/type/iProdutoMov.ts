import type { iProduto } from "./iProduto";

export interface iProdutoMov {
  produto: iProduto;
  qtdMov: number;
  tipoSaida?: string | null;
  tipoEntrada?: string | null;
  tipoMov: string;
  dataMov: Date; 
}