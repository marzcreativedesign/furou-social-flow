
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const OnboardingSteps = [
  {
    title: "Organize eventos com facilidade",
    description: "Crie, compartilhe e gerencie todos os seus encontros em um só lugar",
    image: "/onboarding-1.png",
  },
  {
    title: "Convide seus amigos",
    description: "Compartilhe links de convite e veja quem confirmou em tempo real",
    image: "/onboarding-2.png",
  },
  {
    title: "Vaquinha integrada",
    description: "Divida os custos facilmente com todos os participantes",
    image: "/onboarding-3.png",
  },
  {
    title: "Descontos exclusivos",
    description: "Aproveite ofertas especiais em bares, restaurantes e muito mais",
    image: "/onboarding-4.png",
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex justify-center mb-8">
              <img 
                src={OnboardingSteps[currentStep].image || "/placeholder.svg"}
                alt="Onboarding illustration"
                className="w-64 h-64 object-contain animate-bounce-small"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">{OnboardingSteps[currentStep].title}</h1>
            <p className="text-center text-muted-foreground">{OnboardingSteps[currentStep].description}</p>
          </div>
          
          <div className="flex justify-center gap-1 mb-8">
            {OnboardingSteps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 rounded-full transition-all ${
                  index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
          
          {currentStep < OnboardingSteps.length - 1 ? (
            <button 
              onClick={nextStep}
              className="btn-primary w-full flex justify-center items-center"
            >
              Próximo
              <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <div className="space-y-4">
              <Link to="/auth" className="btn-primary w-full block text-center">
                Começar agora
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
