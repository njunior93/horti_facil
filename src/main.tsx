import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { AppProvider } from './context/context.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CriarEstoque from './paginas/CriarEstoque.tsx';
import GerenciarEstoque from './paginas/GerenciarEstoque.tsx';
import PaginalInicial from './paginas/PaginalInicial.tsx';
import PedidosCompra from './paginas/PedidosCompra.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { EstoqueProvider } from './context/EstoqueProvider.tsx';
import {MainLayout} from "./mainlayout.tsx";


const router = createBrowserRouter([

  {
    path: "/",
    element: <App/>
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

