// Tipagem explícita para os resultados das consultas
interface ProfileQueryResult {
  data: { id: string }[] | null;
  error: any;
}

// Função para semear dados do usuário com base no email
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    const { data, error: queryError }: ProfileQueryResult = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (queryError) {
      console.error('Error querying profile by email:', queryError);
      return {
        success: false,
        error: queryError.message,
      };
    }

    if (data && data.length > 0) {
      return await seedUserData(data[0].id);
    }

    // Verificação de sessão atual
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;

    if (currentUser && currentUser.email === email) {
      return await seedUserData(currentUser.id);
    }

    return {
      success: false,
      error: `Could not find user with email ${email}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ?
