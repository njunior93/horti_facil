import type { GridRowId } from "@mui/x-data-grid";
export interface LinhaItem {
    id: GridRowId;
    minimo: number;
    produto: string;
    recebido: number;
    reposicao: number;
    unidade: string;
}
