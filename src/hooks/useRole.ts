
import { useState } from 'react';

type Role = 'free' | 'premium' | 'admin';

export const useRole = () => {
  // Mock role - always admin for demo purposes
  const [role] = useState<Role>('admin');
  const [isLoading] = useState(false);

  return { role, isLoading };
};
