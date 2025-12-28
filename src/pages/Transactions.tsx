import { useStore } from '../context/StoreContext';
import { FileText, Calendar, DollarSign } from 'lucide-react';

const Transactions = () => {
  const { transactions } = useStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)]">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Sales History</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {transactions.length === 0 ? (
             <div className="text-center py-20">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FileText className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-slate-500 font-medium">No transactions found</h3>
               <p className="text-slate-400 text-sm">Sales will appear here once processed.</p>
             </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="border border-slate-100 rounded-xl p-4 hover:border-blue-200 transition-colors bg-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Order #{tx.id.slice(0, 8)}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-lg text-slate-800">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    {tx.totalAmount.toFixed(2)}
                  </div>
                </div>
                
                <div className="pl-14">
                  <div className="flex flex-wrap gap-2">
                    {tx.items.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
