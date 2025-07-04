import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { AppProvider } from './context/context.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CriarEstoque from './paginas/CriarEstoque.tsx';
import VisualizarEstoque from './componentes/VisualizarEstoque.tsx';
import GerenciarEstoque from './paginas/GerenciarEstoque.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
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
    <AppProvider>
      <RouterProvider router={router}/>
    </AppProvider>
  </StrictMode>,
)

