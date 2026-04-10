import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tags, ReceiptText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Resumen', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transacciones', icon: <ReceiptText size={20} /> },
    { path: '/categories', label: 'Categorías', icon: <Tags size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-ui-bg dark:bg-slate-950 font-sans overflow-hidden">
      {/* Sidebar Lado Izquierdo */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-colors duration-300 shadow-sm z-10 hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-brand-primary dark:text-brand-secondary">
            Flow-Balance
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all outline-none ${
                  isActive 
                    ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-secondary/20 dark:text-brand-secondary font-semibold' 
                    : 'text-ui-text-sub dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-ui-text-main'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-semantic-expense dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer outline-none"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Navegación Móvil (Inferior) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50 flex justify-around p-3 pb-safe-area-inset-bottom">
         {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'text-brand-primary dark:text-brand-secondary font-medium' 
                    : 'text-ui-text-sub dark:text-slate-400'
                }`}
              >
                {link.icon}
                <span className="text-[10px]">{link.label}</span>
              </Link>
            );
          })}
          <button onClick={logout} className="flex flex-col items-center gap-1 p-2 rounded-xl text-semantic-expense dark:text-red-400">
             <LogOut size={20} />
             <span className="text-[10px]">Salir</span>
          </button>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto w-full transition-colors duration-300 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
