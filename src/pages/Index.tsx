
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para a tela de onboarding
    navigate("/onboarding");
  }, [navigate]);

  return null;
};

export default Index;
