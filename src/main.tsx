import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { AppProvider } from './shared/context/context'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CriarEstoque from './features/estoque/pages/CriarEstoque';
import GerenciarEstoque from './features/estoque/pages/GerenciarEstoque';
import PaginalInicial from './pages/PaginalInicial';
import PedidosCompra from '../src/features/pedidos/pages/PedidosCompra.tsx';
import { AuthProvider } from './shared/context/AuthContext';
import { EstoqueProvider } from '../src/features/estoque/provider/EstoqueProvider.tsx';
import {MainLayout} from "./MainLayout.tsx";
import { StatusServidorProvider } from './providers/StatusServidorProvider.tsx';


const router = createBrowserRouter([

  {
    path: "/",
    element:  <StatusServidorProvider><App/></StatusServidorProvider>
  },

  {
    element: <MainLayout/>,
    children: 
    [
      {
        path: "/pagina-inicial",
        element: <EstoqueProvider><PaginalInicial/></EstoqueProvider>
      },

      {
        path: "/criar-estoque",
        element: <EstoqueProvider><CriarEstoque/></EstoqueProvider>
      },
      {
        path: "/gerenciar-estoque",
        element: <EstoqueProvider><GerenciarEstoque/></EstoqueProvider>
      },
      {
        path: "/pedidos-compra",
        element: <EstoqueProvider><PedidosCompra/></EstoqueProvider>
      }
    ]
  }

  
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
          <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  </StrictMode>,
)

