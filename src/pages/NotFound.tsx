
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
        <p className="text-xl text-gray-700 mb-6">Oops! Página não encontrada</p>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe ou foi movida para outra URL.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">Voltar para a Página Inicial</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/records">Ver Registros</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
