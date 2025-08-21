import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import alertaMensagem from "../utils/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { Button } from "@mui/material";




const PaginaLogin = () => {

  const navigate = useNavigate();
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const {session} = useAuth();

  setTimeout(() =>{
    if(alerta){
      setAlerta(null)
    }
  },4000);

  if(loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6]">
        <p className="text-xs md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg">
          Carregando...
        </p>
      </div>
    );
  }

  if (session){
    navigate('/pagina-inicial');
    return null;
  }

  const entrarLogin = async () =>{
    try {
          setLoading(true);
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'google',options: {redirectTo: window.location.origin,},});
    
          if (error) {
            throw error;
          }
    
        } catch (error: unknown) {
          if (error instanceof Error){
          setAlerta(alertaMensagem(`Erro ao acessar: ${error.message}`, 'warning', <ReportProblemIcon/>));
        } else {
          setAlerta(alertaMensagem(`Erro desconhecido`, 'warning', <ReportProblemIcon/>));
        }     
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6] px-4">
      <div className="flex flex-col items-center justify-center gap-3 max-w-xs text-center w-3/5 sm:1/2">  
          <h1 className="font-bold text-gray-800 leading-tight">
            <span className="block text-2xl sm:text-3xl md:text-4xl">HortiFácil</span>
          </h1>   
        <p className="mt-4 text-xs sm:text-sm md:text-lg text-gray-600 leading-tight">Sua plataforma de gestão de estoque de hortifrúti.</p>
        <Button onClick={entrarLogin} variant="contained" sx={{ backgroundColor: "#FB9E3A", border: "2px solid #fff", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#E6521F",},}}>Faça seu Login</Button>
      </div>

      <div className="w-2/5 sm:w-1/2">
        <img src="/logo.png" alt="Logo Inicial" width="600" height="400"/>
      </div>
      
    </div>
  )
}

export default PaginaLogin