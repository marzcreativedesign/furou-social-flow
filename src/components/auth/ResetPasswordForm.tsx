
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schema for validation
const resetSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido")
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBackToLogin: () => void;
  isLoading: boolean;
}

const ResetPasswordForm = ({
  onSubmit,
  onBackToLogin,
  isLoading
}: ResetPasswordFormProps) => {
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: ""
    }
  });

  const handleSubmit = async (values: ResetFormValues) => {
    try {
      await onSubmit(values.email);
    } catch (error) {
      console.error("Reset password form error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>E-mail</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white rounded-full h-12"
        >
          {isLoading ? "Processando..." : "Enviar instruções"}
        </Button>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm text-primary hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
