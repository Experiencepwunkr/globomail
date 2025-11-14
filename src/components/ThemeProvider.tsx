// src/components/ThemeProvider.tsx
'use client';

import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}