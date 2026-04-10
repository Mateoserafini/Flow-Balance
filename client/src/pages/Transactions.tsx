import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, Edit2, Trash2, X, Tag, ReceiptText } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  type: string;
}

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: Category; 
  date: string;
  type: 'income' | 'expense';
}

export default function Transactions() {
  const getLocalDateString = () => {
    const tzOffsetMs = new Date().getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzOffsetMs).toISOString().split('T')[0];
  };
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: getLocalDateString(),
    type: 'expense'
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [incRes, expRes, catRes] = await Promise.all([
        axios.get('/incomes').catch(() => ({ data: [] })),
        axios.get('/expenses').catch(() => ({ data: [] })),
        axios.get('/categories').catch(() => ({ data: { userExpenses: [], userIncomes: [] } }))
      ]);

      const fetchedIncomes = incRes.data.map((i: any) => ({ ...i, type: 'income' }));
      const fetchedExpenses = expRes.data.map((e: any) => ({ ...e, type: 'expense' }));
      const allTrans = [...fetchedIncomes, ...fetchedExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactions(allTrans);
      
      const allCats = [...catRes.data.userExpenses, ...catRes.data.userIncomes];
      setCategories(allCats);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (t?: Transaction) => {
    if (t) {
      setEditId(t._id);
      setFormData({
        amount: t.amount.toString(),
        description: t.description,
        category: t.category?._id || '',
        date: new Date(t.date).toISOString().split('T')[0],
        type: t.type
      });
    } else {
      setEditId(null);
      setFormData({ amount: '', description: '', category: '', date: getLocalDateString(), type: 'expense' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = formData.type === 'income' ? '/incomes' : '/expenses';
      const payload = {
        amount: Number(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date
      };

      if (editId) {
        await axios.put(`${endpoint}/${editId}`, payload);
      } else {
        await axios.post(endpoint, payload);
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error("Error guardando transaccion:", error);
      alert("Error al guardar.");
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm("¿Seguro que deseas eliminar el registro?")) {
      try {
        const endpoint = type === 'income' ? '/incomes' : '/expenses';
        await axios.delete(`${endpoint}/${id}`);
        loadData();
      } catch (error) {
        console.error("Error eliminando:", error);
        alert("No se pudo eliminar.");
      }
    }
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ui-text-main dark:text-slate-100">Transacciones</h1>
          <p className="text-ui-text-sub dark:text-slate-400">Todo tu historial de movimientos</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-md"
        >
          <Plus size={20} /> Nuevo Movimiento
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
         {isLoading ? (
            <div className="p-8 text-center text-slate-500 animate-pulse">Cargando...</div>
         ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <ReceiptText size={48} className="opacity-20 mb-4" />
              <p>No tienes movimientos registrados aún.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Descripción</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Categoría</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Monto</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 text-sm text-ui-text-main dark:text-slate-300">
                         {new Date(t.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-ui-text-main dark:text-slate-200">
                         {t.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-ui-text-sub dark:text-slate-400">
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800">
                            <Tag size={12} /> {t.category?.name || '---'}
                         </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-semantic-income' : 'text-semantic-expense dark:text-red-400'}`}>
                         {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-3">
                         <button onClick={() => openModal(t)} className="text-slate-400 hover:text-brand-primary"><Edit2 size={16} /></button>
                         <button onClick={() => handleDelete(t._id, t.type)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-ui-text-main dark:text-slate-100">
                {editId ? 'Editar Movimiento' : 'Nuevo Movimiento'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
                <button type="button" onClick={() => setFormData({...formData, type: 'expense', category: ''})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${formData.type === 'expense' ? 'bg-white dark:bg-slate-700 shadow text-semantic-expense dark:text-red-400' : 'text-slate-500'}`}>Gasto</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'income', category: ''})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${formData.type === 'income' ? 'bg-white dark:bg-slate-700 shadow text-semantic-income' : 'text-slate-500'}`}>Ingreso</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto ($)</label>
                <input required type="number" step="0.01" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-ui-text-main dark:text-slate-100 focus:ring-2 focus:ring-brand-primary outline-none" placeholder="0.00"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-ui-text-main dark:text-slate-100 focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Ej. Almuerzo corporativo"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-ui-text-main dark:text-slate-100 focus:ring-2 focus:ring-brand-primary outline-none">
                   <option value="" disabled>Selecciona una categoría...</option>
                   {filteredCategories.map(c => (
                     <option key={c._id} value={c._id}>{c.name}</option>
                   ))}
                </select>
                {filteredCategories.length === 0 && (
                   <p className="text-xs text-semantic-savings mt-1">No tienes categorías creadas para este tipo. Ve a la vista de Categorías.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
                <input required type="date" max={getLocalDateString()} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-ui-text-main dark:text-slate-100 focus:ring-2 focus:ring-brand-primary outline-none"/>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-brand-primary text-white font-medium hover:bg-brand-secondary rounded-xl shadow-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
