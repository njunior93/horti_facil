import 'jspdf-autotable';
import type { iPedido } from '../features/pedidos/type/iPedido';
import type { iFiltrosPedido } from '../features/pedidos/type/iFiltrosPedido';
export declare const gerarFiltrosListaPedidosPDF: (listaPedidos: iPedido[], filtrosUtilizados: iFiltrosPedido) => void;
