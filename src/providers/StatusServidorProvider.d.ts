export type StatusServidorContextType = {
    servidorOnline: boolean;
    sessaoAtiva: boolean;
    conexaoInternet: boolean;
};
export declare const StatusServidorContext: import("react").Context<StatusServidorContextType | undefined>;
export declare const StatusServidorProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useInternet: () => StatusServidorContextType | undefined;
