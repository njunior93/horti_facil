import  VisualizarEstoque  from '../componentes/VisualizarEstoque'
import InformaçõesEstoque from '../componentes/InformaçõesEstoque'

const GerenciarEstoque = () => {
  return (
    <div className='flex justify-center item-center h-screen w-screen'>
      <div className='flex justify-center item-center flex-col-reverse sm:flex-row'>
        <div className='flex justify-center items-center'>
          <VisualizarEstoque/>
        </div>

        <div className='flex justify-center items-center'>
          <InformaçõesEstoque telaAtual={'gerenciar-estoque'}/>
        </div>
      </div>    
    </div>
    
  )
}

export default GerenciarEstoque