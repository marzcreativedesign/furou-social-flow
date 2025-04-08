
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          Oops! A página que você está procurando não existe.
        </p>
        <Link to="/" className="btn-primary inline-block">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
