import  VisualizarEstoque  from '../componentes/VisualizarEstoque'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque'

const GerenciarEstoque = () => {
  return (
    <div className='flex justify-center flex-row  items-center h-screen w-screen gap-4'>
      <div className='flex justify-center items-center h-screen w-screen'>
        <VisualizarEstoque/>
      </div>

      <div className='basis-[15vw] w-full'>
        <InformaçõesEstoque telaAtual={'gerenciar-estoque'}/>
      </div>
    </div>
    
  )
}

export default GerenciarEstoque