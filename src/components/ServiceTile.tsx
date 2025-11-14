// src/components/ServiceTile.tsx
import Link from 'next/link';

interface ServiceTileProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export function ServiceTile({ icon, title, description, href }: ServiceTileProps) {
  const getIconColor = (icon: string) => {
  const colors: Record<string, string> = {
    N: 'bg-blue-500',
    P: 'bg-indigo-500',
    C: 'bg-purple-500',
    B: 'bg-green-500',
    I: 'bg-yellow-500',
    V: 'bg-orange-500',
    R: 'bg-red-500',
    U: 'bg-cyan-500',
    M: 'bg-gray-500',
    A: 'bg-pink-500',
    T: 'bg-amber-500',
    N: 'bg-teal-500', // Newspaper
    S: 'bg-lime-500', // Slips
    W: 'bg-emerald-500', // Wallet
  };
  return colors[icon] || 'bg-gray-500';
};
    return colors[icon] || 'bg-gray-500';
  };

  return (
    <Link
      href={href}
      className="block rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100 dark:border-gray-700"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${getIconColor(icon)}`}>
        <span className="text-white font-bold text-lg">{icon.charAt(0)}</span>
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}