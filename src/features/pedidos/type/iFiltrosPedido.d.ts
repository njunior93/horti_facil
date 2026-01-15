export interface iFiltrosPedido {
    status: {
        todos: boolean;
        pendente: boolean;
        entregue: boolean;
        entregueParcial: boolean;
        cancelado: boolean;
    };
    datas: {
        criacao: {
            inicio: Date | null;
            fim: Date | null;
        };
        efetivacao: {
            inicio: Date | null;
            fim: Date | null;
        };
        cancelamento: {
            inicio: Date | null;
            fim: Date | null;
        };
    };
    fornecedor: string;
}
