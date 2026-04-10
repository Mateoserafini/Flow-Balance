import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, Edit2, Trash2, X, Tag, Home, Car, Zap, Utensils, ShoppingBag } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

const AVAILABLE_ICONS = ['tag', 'home', 'car', 'zap', 'utensils', 'shopping'];
const getIcon = (name: string, size = 20) => {
  const icons: Record<string, JSX.Element> = {
    tag: <Tag size={size} />,
    home: <Home size={size} />,
    car: <Car size={size} />,
    zap: <Zap size={size} />,
    utensils: <Utensils size={size} />,
    shopping: <ShoppingBag size={size} />
  };
  return icons[name] || <Tag size={size} />;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [defaultExpenses, setDefaultExpenses] = useState<string[]>([]);
  const [defaultIncomes, setDefaultIncomes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: 'tag',
    color: '#3B82F6'
  });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/categories');
      // The API returns { userExpenses, userIncomes, defaultExpenses, defaultIncomes }
      // We will only allow editing user categories for now.
      const userCats = [...res.data.userExpenses, ...res.data.userIncomes];
      setCategories(userCats);
      setDefaultExpenses(res.data.defaultExpenses || []);
      setDefaultIncomes(res.data.defaultIncomes || []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditId(category._id);
      setFormData({
        name: category.name,
        type: category.type,
        icon: category.icon || 'tag',
        color: category.color || '#3B82F6'
      });
    } else {
      setEditId(null);
      setFormData({ name: '', type: 'expense', icon: 'tag', color: '#3B82F6' });
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
      if (editId) {
        await axios.put(`/categories/${editId}`, formData);
      } else {
        await axios.post('/categories', formData);
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      console.error("Error guardando categoría:", error);
      alert("Hubo un error al guardar la categoría.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await axios.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error eliminando:", error);
        alert("No se pudo eliminar.");
      }
    }
  };

  const addDefaultCategory = async (name: string, type: string) => {
    try {
      await axios.post('/categories', { name, type, icon: 'tag', color: '#64748B' });
      fetchCategories();
    } catch (error) {
       console.error("Error al agregar plantilla:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ui-text-main dark:text-slate-100">Gestión de Categorías</h1>
          <p className="text-ui-text-sub dark:text-slate-400">Administra tus clasificaciones financieras</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-md"
        >
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
           <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
           <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
           <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Listado de Categorías */}
          {['income', 'expense'].map(type => (
            <div key={type} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
               <h2 className="text-xl font-bold mb-4 capitalize text-ui-text-main dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                  {type === 'income' ? 'Ingresos' : 'Gastos'}
               </h2>
               <div className="space-y-3">
                 {categories.filter(c => c.type === type).length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No hay categorías personalizadas</p>
                 ) : (
                   categories.filter(c => c.type === type).map(cat => (
                     <div key={cat._id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-20" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                              {getIcon(cat.icon, 20)}
                           </div>
                           <span className="font-medium text-ui-text-main dark:text-slate-200">{cat.name}</span>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => openModal(cat)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition"><Edit2 size={16}/></button>
                           <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-semantic-expense hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><Trash2 size={16}/></button>
                        </div>
                     </div>
                   ))
                 )}
               </div>
               
               {/* Plantillas Sugeridas */}
               <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-medium text-slate-500 mb-3">Plantillas Sugeridas</p>
                  <div className="flex flex-wrap gap-2">
                    {(type === 'income' ? defaultIncomes : defaultExpenses)
                      .filter(name => !categories.find(c => c.name === name && c.type === type))
                      .map(name => (
                        <button 
                          key={name}
                          onClick={() => addDefaultCategory(name, type)}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-primary hover:text-white transition"
                        >
                          + {name}
                        </button>
                    ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-ui-text-main dark:text-slate-100">
                {editId ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-ui-text-main dark:text-slate-100 focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Ej. Compras"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-ui-text-main dark:text-slate-100 focus:ring-2 focus:ring-brand-primary outline-none">
                   <option value="expense">Gasto</option>
                   <option value="income">Ingreso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
                <div className="flex gap-3">
                  <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                  <div className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center">
                     <span className="text-slate-500 font-mono text-sm">{formData.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icono</label>
                <div className="flex gap-2 flex-wrap">
                  {AVAILABLE_ICONS.map(iconName => (
                    <button 
                      key={iconName} type="button" 
                      onClick={() => setFormData({...formData, icon: iconName})}
                      className={`p-3 rounded-xl transition ${formData.icon === iconName ? 'bg-brand-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      {getIcon(iconName, 20)}
                    </button>
                  ))}
                </div>
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
