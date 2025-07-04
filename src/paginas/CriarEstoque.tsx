import BotoesFinalizarCancelarEstoque from '../componentes/BotoesFinalizarCancelarEstoque.tsx'
import Formulario from '../componentes/Formulario.tsx'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque.tsx'
import ListaProdutos from '../componentes/ListaProdutos.tsx'

function CriarEstoque() {
  

  return (
    <>
      
      <div className="flex justify-center flex-row  items-center h-screen w-screen gap-4">
        <div className="w-full h-4/5 p-4 rounded-lg shadow-md bg-[#FCEED5] basis-[80vw]">
          <Formulario />
          <ListaProdutos />
          <BotoesFinalizarCancelarEstoque/>        
        </div>
        
        <div className='basis-[15vw] w-full'>
            <InformaçõesEstoque telaAtual={'criar-estoque'}  />
        </div>

      </div>
    </>
  )
}

export default CriarEstoque