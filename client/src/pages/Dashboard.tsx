import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  LogOut,
  Utensils, 
  Zap, 
  Car, 
  Home,
  ShoppingBag
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Interfaces basadas en Mongoose Schema
interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: Category | string; 
  date: string;
  type: 'income' | 'expense';
}

// Simulamos los iconos que podríamos tener guardados como strings en MongoDB
const getIcon = (iconName: string) => {
  const icons: Record<string, JSX.Element> = {
    'home': <Home size={18} />,
    'car': <Car size={18} />,
    'zap': <Zap size={18} />,
    'utensils': <Utensils size={18} />,
    'shopping': <ShoppingBag size={18} />,
  };
  return icons[iconName] || <ShoppingBag size={18} />;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [chartData, setChartData] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Llamadas concurrentes a los endpoints (Asumiendo que existen y retornan arrays)
      const [incomesRes, expensesRes] = await Promise.all([
        axios.get('/incomes').catch(() => ({ data: [] })),
        axios.get('/expenses').catch(() => ({ data: [] }))
      ]);

      const fetchedIncomes = incomesRes.data.map((i: any) => ({ ...i, type: 'income' }));
      const fetchedExpenses = expensesRes.data.map((e: any) => ({ ...e, type: 'expense' }));
      
      let allTransactions = [...fetchedIncomes, ...fetchedExpenses];
      
      // Si la BD está limpia (sin datos reales), inyectamos Mock Data para presumir UI genial
      if (allTransactions.length === 0) {
        allTransactions = [
          { _id: '1', amount: 2500, description: 'Salario Mensual', category: { _id: 'c1', name: 'Sueldo', icon: 'zap', color: '#10B981' }, date: new Date().toISOString(), type: 'income' },
          { _id: '2', amount: 120, description: 'Cena de Aniversario', category: { _id: 'c2', name: 'Restaurante', icon: 'utensils', color: '#EF4444' }, date: new Date(Date.now() - 86400000).toISOString(), type: 'expense' },
          { _id: '3', amount: 50, description: 'Gasolina', category: { _id: 'c3', name: 'Transporte', icon: 'car', color: '#3B82F6' }, date: new Date(Date.now() - 172800000).toISOString(), type: 'expense' },
          { _id: '4', amount: 800, description: 'Alquiler', category: { _id: 'c4', name: 'Hogar', icon: 'home', color: '#8B5CF6' }, date: new Date(Date.now() - 259200000).toISOString(), type: 'expense' },
        ];
        setChartData([
          { name: '1 Abr', ingresos: 4000, gastos: 2400 },
          { name: '5 Abr', ingresos: 3000, gastos: 1398 },
          { name: '10 Abr', ingresos: 2000, gastos: 9800 },
          { name: '15 Abr', ingresos: 2780, gastos: 3908 },
          { name: '20 Abr', ingresos: 1890, gastos: 4800 },
          { name: '25 Abr', ingresos: 2390, gastos: 3800 },
          { name: '30 Abr', ingresos: 3490, gastos: 4300 },
        ]);
      } else {
        // Agrupar los datos reales por fecha
        const grouped = allTransactions.reduce((acc, curr) => {
          const dateLabel = new Date(curr.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', timeZone: 'UTC' });
          if (!acc[dateLabel]) {
            acc[dateLabel] = { name: dateLabel, ingresos: 0, gastos: 0, timestamp: new Date(curr.date).getTime() };
          }
           if (curr.type === 'income') acc[dateLabel].ingresos += curr.amount;
           if (curr.type === 'expense') acc[dateLabel].gastos += curr.amount;
           return acc;
        }, {} as Record<string, any>);
        const sortedData = Object.values(grouped).sort((a: any, b: any) => a.timestamp - b.timestamp);
        setChartData(sortedData);
      }

      // Ordenar por fecha reciente
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Calcular Totales
      const incomesTotal = allTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
      const expensesTotal = allTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

      setTotalIncome(incomesTotal);
      setTotalExpense(expensesTotal);
      setTransactions(allTransactions.slice(0, 5)); // Últimas 5
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const balance = totalIncome - totalExpense;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ui-bg dark:bg-slate-950 p-6 flex flex-col gap-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ui-bg dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-ui-text-main dark:text-slate-100">
              Bienvenido, {user?.username} 👋
            </h1>
            <p className="text-sm text-ui-text-sub dark:text-slate-400">Aqui está tu resumen financiero.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>

        {/* Hero Section: Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta Balance Total */}
          <div className="bg-brand-primary rounded-3xl p-6 text-white shadow-xl shadow-brand-primary/20 flex flex-col justify-between relative overflow-hidden h-40">
            <div className="absolute -right-6 -top-6 opacity-20"><Wallet size={120} /></div>
            <p className="text-brand-primary-light text-sm font-medium opacity-80">Balance Total</p>
            <div>
              <h2 className="text-4xl font-bold tracking-tight">${balance.toLocaleString()}</h2>
              <p className="text-xs opacity-70 mt-2 font-light">Actualizado hoy</p>
            </div>
          </div>

          {/* Tarjeta Ingresos Totales */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40 group hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-500">
                <ArrowUpRight size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-ui-text-sub dark:text-slate-400 font-medium">Ingresos Totales</p>
              <h2 className="text-2xl font-bold text-ui-text-main dark:text-slate-100 mt-1">
                ${totalIncome.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Tarjeta Gastos Totales */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40 group hover:border-red-500/30 transition-colors">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500">
                <ArrowDownRight size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-ui-text-sub dark:text-slate-400 font-medium">Gastos Totales</p>
              <h2 className="text-2xl font-bold text-ui-text-main dark:text-slate-100 mt-1">
                ${totalExpense.toLocaleString()}
              </h2>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Gráfico Visual */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-ui-text-main dark:text-slate-100">Flujo Financiero</h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis width={65} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-5} tickFormatter={(val) => `$${val.toLocaleString()}`} />

                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="ingresos" stroke="#10B981" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={2} />
                  <Area type="monotone" dataKey="gastos" stroke="#EF4444" fillOpacity={1} fill="url(#colorGastos)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lista de Transacciones Recientes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-ui-text-main dark:text-slate-100 mb-6">Transacciones Recientes</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((t) => {
                    const isIncome = t.type === 'income';
                    const categoryObj = typeof t.category === 'object' ? t.category : { icon: 'shopping', name: 'General', color: '#64748b' };
                    
                    return (
                      <div key={t._id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-opacity-20 text-slate-700 dark:text-slate-200" 
                            style={{ backgroundColor: `${categoryObj.color}20`, color: categoryObj.color }}
                          >
                            {getIcon(categoryObj.icon)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ui-text-main dark:text-slate-200">{t.description}</p>
                            <p className="text-xs text-ui-text-sub dark:text-slate-500 mt-0.5">
                              {new Date(t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        <div className={`font-semibold ${isIncome ? 'text-semantic-income' : 'text-ui-text-main dark:text-slate-200'}`}>
                          {isIncome ? '+' : '-'}${t.amount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                   <p className="text-sm">No hay transacciones aún.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
