import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import alertaMensagem from "../shared/components/alertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useAuth } from "../shared/context/AuthContext";
import { supabase } from "../supabaseClient";
import { Button } from "@mui/material";

const PaginaLogin = () => {

  const navigate = useNavigate();
  const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const {session} = useAuth();

   useEffect(() => {
     if (!alerta) return;

    const timer = setTimeout(() => {
      setAlerta(null);
    }, 4000);

    return () => clearTimeout(timer);
    }, [alerta]);

   useEffect(() => {
    if (session) {
      navigate('/pagina-inicial');
    }
  }, [session, navigate]);

  if(loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#FDEFD6]">
        <p className="text-xs md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-red-700 text-transparent bg-clip-text drop-shadow-lg">
          Carregando...
        </p>
      </div>
    );
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
    <div className="flex justify-center items-center min-h-screen w-screen bg-[#FDEFD6] px-6 py-10">

      {/* Container de conteúdo com largura máxima para não se expandir em telas grandes */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full max-w-4xl">

        {/* Conteúdo: título, descrição e botão — abaixo no mobile, à esquerda no desktop */}
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full md:w-1/2 order-2 md:order-1">
          <h1 className="font-bold text-gray-800 leading-tight">
            <span className="block text-3xl sm:text-4xl md:text-5xl">HortiFácil</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-snug max-w-xs">
            Sua plataforma de gestão de estoque de hortifrúti.
          </p>
          <Button
            onClick={entrarLogin}
            variant="contained"
            sx={{
              backgroundColor: "#FB9E3A",
              border: "2px solid #fff",
              borderRadius: "1rem",
              color: "#fff",
              px: 3,
              py: 1,
              '&:hover': { backgroundColor: "#E6521F" },
            }}
          >
            Faça seu Login
          </Button>
        </div>

        {/* Imagem — no topo no mobile, à direita no desktop */}
        <div className="flex justify-center items-center w-full md:w-1/2 order-1 md:order-2">
          <img
            src="/logo.png"
            alt="Logo Inicial"
            className="w-52 sm:w-72 md:w-full max-w-sm object-contain"
          />
        </div>

      </div>
    </div>
  )
}

export default PaginaLogin