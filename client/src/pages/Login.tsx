import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error de conexión con el servidor. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ui-bg dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ui-text-main dark:text-slate-100 mb-2">Bienvenido a Flow-Balance</h1>
          <p className="text-ui-text-sub dark:text-slate-400">Inicia sesión en tu cuenta para continuar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-semantic-expense dark:bg-red-900/20 text-sm rounded-lg border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ui-text-main dark:text-slate-300 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ui-text-main dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary transition-all"
              placeholder="tu@correo.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ui-text-main dark:text-slate-300 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ui-text-main dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary transition-all"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-secondary disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex justify-center items-center"
          >
            {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-ui-text-sub dark:text-slate-400">
          ¿No tienes una cuenta?{' '}
          <Link 
            to="/register"
            className="text-brand-secondary font-medium hover:underline focus:outline-none cursor-pointer"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
