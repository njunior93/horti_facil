import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { AppProvider } from './context/context.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CriarEstoque from './paginas/CriarEstoque.tsx';
import GerenciarEstoque from './paginas/GerenciarEstoque.tsx';
import PaginalInicial from './paginas/PaginalInicial.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { StatusServidorProvider } from './context/StatusServidorProvider.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },

  {
    path: "/pagina-inicial",
    element: <StatusServidorProvider><PaginalInicial/></StatusServidorProvider>
  },

  {
    path: "/criar-estoque",
    element: <StatusServidorProvider><CriarEstoque/></StatusServidorProvider>
  },
  {
    path: "/gerenciar-estoque",
    element: <StatusServidorProvider><GerenciarEstoque/></StatusServidorProvider>
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

