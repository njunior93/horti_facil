export type EstoqueContextType = {
    existeEstoque: boolean | null;
    loading: boolean;
    verificarEstoque: () => Promise<void>;
};
export declare const EstoqueContext: import("react").Context<EstoqueContextType | undefined>;
export declare const EstoqueProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useEstoque: () => EstoqueContextType | undefined;
