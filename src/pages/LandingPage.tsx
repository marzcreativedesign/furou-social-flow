
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Users, 
  Camera, 
  MessageCircle,
  CreditCard,
  Sun,
  Moon,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      toast({
        title: "Inscrição realizada!",
        description: "Você será notificado quando o app for lançado.",
      });
      setEmail("");
    } else {
      toast({
        title: "Erro!",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Crie e compartilhe eventos em segundos",
      description: "Organize qualquer tipo de evento com poucos cliques."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Organize grupos de amigos ou eventos abertos",
      description: "Controle quem pode ver e participar dos seus eventos."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Orçamento colaborativo opcional",
      description: "Divida custos de forma transparente com todos os participantes."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Agenda integrada e calendário visual",
      description: "Visualize todos os seus eventos em um só lugar."
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Galeria de fotos pós-evento",
      description: "Compartilhe memórias e reviva os melhores momentos."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Espaço para conversas e decisões",
      description: "Comunique-se facilmente com todos os participantes."
    }
  ];

  const testimonials = [
    {
      name: "Marina Silva",
      role: "Beta Tester",
      comment: "Depois de usar o Furou?!, não consigo mais imaginar organizar eventos de outro jeito. Super prático!",
      avatar: "MS"
    },
    {
      name: "Pedro Alves",
      role: "Organizador de eventos",
      comment: "A função de orçamento colaborativo resolveu aquela dor de cabeça de dividir despesas. Agora tudo fica transparente!",
      avatar: "PA"
    },
    {
      name: "Juliana Costa",
      role: "Beta Tester",
      comment: "Adoro como posso ver todos os eventos que fui convidada em um só lugar, com lembretes e tudo mais!",
      avatar: "JC"
    }
  ];

  const faqItems = [
    {
      question: "É gratuito para usar?",
      answer: "Sim! O Furou?! é totalmente gratuito para usuários comuns. Temos planos premium para organizadores de eventos maiores com recursos adicionais."
    },
    {
      question: "Preciso de conta para criar evento?",
      answer: "Sim, é necessário criar uma conta para organizar eventos, mas o processo é rápido e simples."
    },
    {
      question: "Posso convidar pessoas que não têm conta no app?",
      answer: "Absolutamente! Você pode convidar qualquer pessoa por e-mail ou link, mesmo que ainda não tenha o app instalado."
    },
    {
      question: "Como funciona o orçamento colaborativo?",
      answer: "O organizador define os itens necessários, e os participantes podem escolher com o que querem contribuir. O app acompanha tudo automaticamente!"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Dark/Light Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
          aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-background via-background to-accent/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?q=80&w=1974')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto max-w-7xl">
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-full w-8 h-8"></div>
              <span className="text-2xl font-bold text-foreground">Furou?!</span>
            </div>
            <Button 
              onClick={() => navigate("/login")}
              variant="outline"
            >
              Login
            </Button>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Transforme qualquer encontro em um evento memorável.
              </h1>
              <p className="text-xl text-muted-foreground">
                Com o Furou?! você cria, organiza e compartilha eventos de um jeito rápido, divertido e colaborativo.
              </p>
              <form onSubmit={handleSubmitEmail} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="email" className="sr-only">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Quero ser avisado no lançamento!
                </Button>
              </form>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative max-w-[400px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-3 scale-105"></div>
                <AspectRatio ratio={9/16} className="overflow-hidden bg-card rounded-3xl border shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1974" 
                    alt="Amigos se divertindo em um evento" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-lg font-semibold">Churrasco na Praia</h3>
                    <p className="text-white/80 text-sm">12 amigos confirmados</p>
                  </div>
                </AspectRatio>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-accent/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-3">Sobre o Furou?!</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Uma plataforma moderna e intuitiva para criar e gerenciar eventos sem complicações. 
            Organize churrascos, festas, encontros casuais ou eventos maiores com a mesma facilidade.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center p-6 bg-card rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-3 text-center">Conheça o app</h2>
          <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
            Veja as principais telas do Furou?! e descubra como ele vai transformar a maneira como você organiza eventos
          </p>
          
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[
                { title: "Home", description: "Visualize todos seus eventos em um só lugar", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1969" },
                { title: "Detalhe do evento", description: "Todas as informações importantes de forma organizada", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1970" },
                { title: "Orçamento", description: "Gerencie despesas de forma colaborativa", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1936" },
                { title: "Galeria", description: "Compartilhe memórias com todos os participantes", img: "https://images.unsplash.com/photo-1496843916299-590492c751f4?q=80&w=1971" },
                { title: "Confirmação", description: "Confirme presença com um clique", img: "https://images.unsplash.com/photo-1471967183320-ee018f6e114a?q=80&w=2071" }
              ].map((screen, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={9/16} className="bg-muted">
                        <img 
                          src={screen.img} 
                          alt={screen.title}
                          className="object-cover w-full h-full" 
                        />
                      </AspectRatio>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{screen.title}</h3>
                        <p className="text-sm text-muted-foreground">{screen.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-12" />
            <CarouselNext className="hidden sm:flex -right-12" />
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-secondary/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-3">O que estão dizendo</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Mais de 1.000 grupos já estão esperando pelo lançamento!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg border p-6 text-left"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Diferenciais do app</h2>
              <ul className="space-y-6">
                {[
                  { title: "Integração simples", desc: "Se conecta com suas outras ferramentas e calendários" },
                  { title: "Design acessível", desc: "Pensado para todos os públicos e necessidades" },
                  { title: "Modo claro/escuro", desc: "Personalize a interface de acordo com sua preferência" }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-lg"></div>
              <div className="relative bg-card border rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1974" 
                  alt="App interface" 
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-accent/10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-3 text-center">Perguntas frequentes</h2>
          <p className="text-xl text-muted-foreground mb-12 text-center">
            Tire suas principais dúvidas sobre o Furou?!
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Garanta seu acesso antecipado!</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Seja um dos primeiros a experimentar o Furou?! e transforme a maneira como você organiza eventos.
            </p>
            <form onSubmit={handleSubmitEmail} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
              <div className="flex-1">
                <Label htmlFor="email-bottom" className="sr-only">Email</Label>
                <Input
                  id="email-bottom"
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Quero participar! <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 lg:px-24 bg-muted/30 border-t">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary rounded-full w-8 h-8"></div>
                <span className="text-xl font-bold">Furou?!</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Transforme qualquer encontro em um evento memorável com o Furou?!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos de Serviço</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2">
                <li><a href="mailto:contato@furou.app" className="text-muted-foreground hover:text-foreground transition-colors">contato@furou.app</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-muted text-center text-sm text-muted-foreground">
            <p>© 2025 Furou?! Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
