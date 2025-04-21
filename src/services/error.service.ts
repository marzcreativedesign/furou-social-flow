
import { toast } from "@/hooks/use-toast";

export const ErrorService = {
  // Mapeia códigos de erro para mensagens amigáveis
  errorMessages: {
    'PGRST116': 'Nenhum resultado encontrado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'not-found': 'Recurso não encontrado',
    'unauthorized': 'Acesso não autorizado',
    'forbidden': 'Acesso proibido'
  } as Record<string, string>,
  
  // Função para lidar com erros de forma consistente
  handleError: (error: any, context: string = '') => {
    console.error(`Error in ${context}:`, error);
    
    // Determinar a mensagem de erro
    let message = 'Ocorreu um erro inesperado';
    let description = '';
    
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.code && ErrorService.errorMessages[error.code]) {
      message = ErrorService.errorMessages[error.code];
    }
    
    if (context) {
      description = message;
      message = context;
    }
    
    // Exibir toast de erro
    toast({
      title: message,
      description: description || undefined,
      variant: "destructive",
    });
    
    // Retornar a mensagem para uso adicional se necessário
    return message;
  }
};
