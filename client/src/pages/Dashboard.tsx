import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-ui-bg dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-ui-text-main dark:text-slate-100 text-center md:text-left">
            Panel de Control
          </h1>
          <button
            onClick={logout}
            className="px-5 py-2.5 bg-red-50 text-semantic-expense dark:bg-red-900/30 font-medium rounded-xl hover:bg-red-100 focus:outline-none transition-colors border border-red-100 dark:border-red-900/50 shadow-sm"
          >
            Cerrar Sesión
          </button>
        </div>
        
        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 md:p-8 border border-gray-100 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-2 text-ui-text-main dark:text-slate-200">
            ¡Hola de nuevo, {user?.username}! 👋
          </h2>
          <p className="text-ui-text-sub dark:text-slate-400 mb-6">
            Bienvenido a tu tablero principal seguro. Aquí gestionarás tus gastos e ingresos.
          </p>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20">
              <h3 className="text-xs font-semibold text-ui-text-sub dark:text-slate-500 uppercase tracking-wider">
                Resumen de Cuenta
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="w-24 text-sm font-medium text-ui-text-sub dark:text-slate-500">ID Usuario</span> 
                  <span className="font-mono text-sm text-ui-text-main dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded inline-block w-max">{user?.id}</span>
                </li>
                <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="w-24 text-sm font-medium text-ui-text-sub dark:text-slate-500">Nombre</span> 
                  <span className="text-ui-text-main dark:text-slate-200 font-medium">{user?.username}</span>
                </li>
                <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="w-24 text-sm font-medium text-ui-text-sub dark:text-slate-500">Email</span> 
                  <span className="text-ui-text-main dark:text-slate-200">{user?.email}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
