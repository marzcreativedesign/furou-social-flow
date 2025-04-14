
import React from 'react';
import LandingHeader from '@/components/LandingHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
              Nunca mais perca um encontro com seus amigos
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Crie eventos, convide amigos, divida custos e mantenha todos informados em um só lugar.
              Acabou a desculpa de "Furou?!"
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="text-lg px-8 bg-primary hover:bg-primary/90"
              >
                <Link to="/auth">Criar minha conta</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="text-lg px-8 border-primary text-primary hover:bg-primary/10"
              >
                <Link to="/auth">Já tenho conta</Link>
              </Button>
            </div>

            <div className="mt-12 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-lg blur opacity-30"></div>
              <div className="relative bg-background rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80" 
                  alt="Amigos se divertindo" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Tudo o que você precisa para <span className="text-primary">organizar momentos inesquecíveis</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Crie eventos facilmente"
                description="Configure eventos em poucos cliques, defina data, local e convide seus amigos."
                icon="🗓️"
              />
              <FeatureCard 
                title="Divida custos sem dor de cabeça"
                description="Controle gastos do grupo e divida os custos de forma justa e transparente."
                icon="💸"
              />
              <FeatureCard 
                title="Mantenha todos informados"
                description="Atualizações em tempo real, confirmações de presença e chat integrado."
                icon="💬"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-muted">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              O que nossos usuários estão dizendo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard 
                quote="Não consigo mais imaginar organizar uma reunião com amigos sem o Furou?! É simples e prático!"
                author="Maria Silva"
                role="Usuária desde 2024"
              />
              <TestimonialCard 
                quote="A calculadora de divisão de custos salvou minhas confraternizações. Nada de confusão na hora de dividir a conta!"
                author="João Oliveira"
                role="Usuário desde 2024"
              />
            </div>

            <div className="text-center mt-16">
              <Button 
                size="lg" 
                asChild
                className="text-lg px-8 bg-primary hover:bg-primary/90"
              >
                <Link to="/auth">Experimente agora</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Furou?!</h3>
                <p className="text-muted-foreground">
                  Sua plataforma para organizar eventos e manter seus amigos informados.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Plataforma</h4>
                <ul className="space-y-2">
                  <li><Link to="/explorar" className="text-muted-foreground hover:text-primary">Explorar</Link></li>
                  <li><Link to="/auth" className="text-muted-foreground hover:text-primary">Criar conta</Link></li>
                  <li><Link to="/auth" className="text-muted-foreground hover:text-primary">Login</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Recursos</h4>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-muted-foreground hover:text-primary">Guia de uso</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-primary">Contato</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-muted-foreground hover:text-primary">Termos de uso</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-primary">Política de privacidade</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-8 pt-6 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Furou?! Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role }) => {
  return (
    <div className="bg-background border rounded-lg p-6 shadow-sm">
      <p className="text-lg mb-4 italic">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default LandingPage;
