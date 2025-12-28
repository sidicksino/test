import { useStore } from '../context/StoreContext';
import StatCard from '../components/StatCard';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { medicines, transactions } = useStore();

  const totalSales = transactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalStock = medicines.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockItems = medicines.filter(m => m.stock <= m.minStockAlert).length;
  
  // Dummy data for the chart since we don't have historical data yet
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`$${totalSales.toFixed(2)}`} 
          icon={DollarSign} 
          trend="12.5%" 
          trendUp={true} 
          color="green"
        />
        <StatCard 
          title="Total Inventory" 
          value={totalStock} 
          icon={Package} 
          trend="5%" 
          trendUp={true} 
          color="blue"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockItems} 
          icon={AlertTriangle} 
          color="orange"
        />
        <StatCard 
          title="Daily Revenue" 
          value="$1,240" 
          icon={TrendingUp} 
          trend="2.1%" 
          trendUp={false} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Widget */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Order #{tx.id.slice(0, 6)}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                </div>
                <span className="font-bold text-emerald-600">+${tx.totalAmount.toFixed(2)}</span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-slate-400 py-4">No transactions yet</p>
            )}
            <button className="w-full mt-4 py-2 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
