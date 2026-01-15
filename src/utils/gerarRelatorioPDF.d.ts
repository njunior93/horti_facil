import 'jspdf-autotable';
import type { iProdutoMov } from '../shared/type/iProdutoMov';
export declare const gerarRelatorioPDF: (listaDeProdutosMov: iProdutoMov[], tipoMovSelecionado: string, movimentacaoSelecionada: string, dataInicio: Date, dataFim: Date) => void;
