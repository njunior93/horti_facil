import BotoesFinalizarCancelarEstoque from '../componentes/BotoesFinalizarCancelarEstoque.tsx'
import Formulario from '../componentes/Formulario.tsx'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque.tsx'
import ListaProdutos from '../componentes/ListaProdutos.tsx'

function CriarEstoque() {
  

  return (
    <>
      
      <div className="flex justify-center items-center h-screen w-screen ">
        <div className='flex justify-center items-center flex-col-reverse sm:flex-row'>
          <div className="flex flex-col w-full sm:size-min p-4 rounded-lg shadow-md bg-[#FCEED5]  gap-2 sm:gap-1 justify-center ">
            <Formulario />
            <ListaProdutos />
            <BotoesFinalizarCancelarEstoque/>        
          </div>
        
          <div className='flex justify-center items-center'>
              <InformaçõesEstoque telaAtual={'criar-estoque'}  />
          </div>
        </div>
      </div>
    </>
  )
}

export default CriarEstoque