import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import type { CartItem } from '../types';

const POS = () => {
  const { medicines, processTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const filteredProducts = medicines.filter(m => 
    m.stock > 0 &&
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (product: typeof medicines[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Check stock limit
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        const stock = medicines.find(m => m.id === id)?.stock || 0;
        if (newQty > stock) return item;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    processTransaction(cart.map(c => ({ id: c.id, quantity: c.quantity })), total);
    setCart([]);
    setSuccessMsg('Transaction completed successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-2">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                  {product.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">Stock: {product.stock}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
              <p className="text-emerald-600 font-bold">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Current Order
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-500">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:bg-white rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="font-bold text-sm text-slate-800 w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:bg-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-100 space-y-4">
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-slate-800">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Complete Sale
          </button>
          
          {successMsg && (
            <p className="text-center text-sm text-emerald-600 font-medium animate-pulse">
              {successMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default POS;
