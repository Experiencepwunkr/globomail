// src/lib/auth.ts
export interface Agent {
  id: string;
  email: string;
  name: string;
  phone: string;
  walletBalance: number;
}

export const saveAgent = (agent: Agent) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('agent', JSON.stringify(agent));
  }
};

export const getAgent = (): Agent | null => {
  if (typeof window === 'undefined') return null;
  const agentStr = localStorage.getItem('agent');
  return agentStr ? JSON.parse(agentStr) : null;
};

export const clearAgent = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('agent');
  }
};