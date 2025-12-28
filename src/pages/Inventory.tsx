import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Search, Filter, Trash2, Edit2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Inventory = () => {
  const { medicines, deleteMedicine } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)]">
      {/* Toolbar */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 font-medium">
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Medicine Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Price</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Stock</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Expiry Date</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMedicines.map((med) => (
              <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">{med.name}</p>
                  <p className="text-xs text-slate-400">ID: {med.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {med.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">${med.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={clsx("font-medium", med.stock < med.minStockAlert ? "text-red-600" : "text-slate-800")}>
                      {med.stock} units
                    </span>
                    {med.stock < med.minStockAlert && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{med.expiryDate}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteMedicine(med.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
