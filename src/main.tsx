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


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },

  {
    path: "/pagina-inicial",
    element: <PaginalInicial/>
  },

  {
    path: "/criar-estoque",
    element: <CriarEstoque/>
  },
  {
    path: "/gerenciar-estoque",
    element: <GerenciarEstoque/>
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

