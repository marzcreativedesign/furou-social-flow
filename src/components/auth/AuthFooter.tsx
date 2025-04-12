
import { Link } from "react-router-dom";

const AuthFooter = () => {
  return (
    <div className="mt-8 text-center text-sm text-muted-foreground">
      <p className="mb-2">
        Não tem uma conta?{" "}
        <Link to="/onboarding" className="text-primary hover:underline font-medium">
          Cadastre-se
        </Link>
      </p>
      <p>
        Ao continuar, você concorda com nossos{" "}
        <Link to="/termos" className="text-primary hover:underline">
          Termos de Serviço
        </Link>{" "}
        e{" "}
        <Link to="/privacidade" className="text-primary hover:underline">
          Política de Privacidade
        </Link>
        .
      </p>
    </div>
  );
};

export default AuthFooter;
