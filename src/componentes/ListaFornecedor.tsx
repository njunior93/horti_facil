import { useContext } from "react";
import { AppContext } from "../context/context";

const ListaFornecedor = () => {

  const {listaFornecedores} = useContext(AppContext);

  
  return (
    <div className='bg-[#EAEFEF] h-32 mt-2 overflow-auto text-sm' >
      <div className={`grid grid-cols-6 items-center p-2 border-b text-center`}>
        <div className="font-medium">Razão Social</div>
        <div>Telefone</div>
        <div>Celular</div>
        <div>Email</div>
        <div>Notificação email</div>
        <div>Notificação WhatsApp</div>
      </div>

       {listaFornecedores.map((fornecedor) => (
        <div key={fornecedor.id} className={`grid grid-cols-6 items-center p-2 border-b text-center`}>
          <div>{fornecedor.nome}</div>
          <div>{fornecedor.telefone}</div>
          <div>{fornecedor.whatsApp}</div>
          <div>{fornecedor.email}</div>
          <div>{fornecedor.noti_email}</div>
          <div>{fornecedor.noti_whatsapp}</div>
        </div>
      ))}
    </div>
  )
}

export default ListaFornecedor