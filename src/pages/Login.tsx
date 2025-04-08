
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Apple, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (provider: string) => {
    setIsLoading(true);
    // Simulando login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-primary">Furou?!</h1>
            <p className="text-muted-foreground">
              Conecte-se para organizar eventos incríveis com seus amigos
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 rounded-full px-6 py-3 font-medium hover:bg-gray-50"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.0223 13.607 12.1761 14.9999 9.99984 14.9999C7.23872 14.9999 4.99984 12.7611 4.99984 9.99996C4.99984 7.23885 7.23872 4.99996 9.99984 4.99996C11.2744 4.99996 12.434 5.48524 13.3169 6.26746L15.6744 3.90996C14.1839 2.52996 12.1928 1.66663 9.99984 1.66663C5.39776 1.66663 1.6665 5.39788 1.6665 9.99996C1.6665 14.602 5.39776 18.3333 9.99984 18.3333C14.602 18.3333 18.3332 14.602 18.3332 9.99996C18.3332 9.44121 18.2757 8.89579 18.1711 8.36788Z"
                  fill="#FFC107"
                />
                <path
                  d="M2.62744 6.12415L5.36536 8.12936C6.10619 6.29507 7.90036 4.99996 9.99994 4.99996C11.2745 4.99996 12.4341 5.48524 13.317 6.26746L15.6745 3.90996C14.184 2.52996 12.1929 1.66663 9.99994 1.66663C6.79911 1.66663 4.02327 3.47371 2.62744 6.12415Z"
                  fill="#FF3D00"
                />
                <path
                  d="M10 18.3333C12.1525 18.3333 14.1084 17.4958 15.5892 16.1525L13.0034 13.9358C12.1432 14.5825 11.0865 14.9999 10 14.9999C7.83255 14.9999 5.99028 13.6175 5.29747 11.6841L2.58331 13.8133C3.96081 16.5158 6.76163 18.3333 10 18.3333Z"
                  fill="#4CAF50"
                />
                <path
                  d="M18.1712 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3917 13.0021 13.9367L13.0042 13.935L15.5901 16.1517C15.4021 16.3267 18.3334 14.1667 18.3334 10.0001C18.3334 9.44129 18.2758 8.89587 18.1712 8.36796Z"
                  fill="#1976D2"
                />
              </svg>
              <span>Continuar com Google</span>
            </button>

            <button
              onClick={() => handleLogin("apple")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-full px-6 py-3 font-medium hover:bg-gray-900"
            >
              <Apple size={20} />
              <span>Continuar com Apple</span>
            </button>

            <button
              onClick={() => handleLogin("email")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-full px-6 py-3 font-medium hover:bg-primary-600"
            >
              <Mail size={20} />
              <span>Continuar com E-mail</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
