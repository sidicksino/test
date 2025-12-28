import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Medicine, Transaction } from '../types';

interface StoreContextType {
  medicines: Medicine[];
  transactions: Transaction[];
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, updated: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  processTransaction: (items: { id: string; quantity: number }[], total: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_MEDICINES: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Painkiller', price: 5.0, stock: 120, expiryDate: '2025-12-01', minStockAlert: 50 },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 12.5, stock: 45, expiryDate: '2024-08-15', minStockAlert: 20 },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Painkiller', price: 8.0, stock: 85, expiryDate: '2026-01-20', minStockAlert: 30 },
  { id: '4', name: 'Cetirizine 10mg', category: 'Antihistamine', price: 4.5, stock: 200, expiryDate: '2025-05-10', minStockAlert: 40 },
  { id: '5', name: 'Vitamin C 1000mg', category: 'Supplement', price: 15.0, stock: 15, expiryDate: '2024-11-30', minStockAlert: 20 },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addMedicine = (medicine: Medicine) => {
    setMedicines(prev => [...prev, medicine]);
  };

  const updateMedicine = (id: string, updated: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const processTransaction = (cartItems: { id: string; quantity: number }[], total: number) => {
    // 1. Update stock
    setMedicines(prev => prev.map(m => {
      const item = cartItems.find(c => c.id === m.id);
      if (item) {
        return { ...m, stock: m.stock - item.quantity };
      }
      return m;
    }));

    // 2. Create transaction record
    const fullItems = cartItems.map(c => {
      const med = medicines.find(m => m.id === c.id)!;
      return { ...med, quantity: c.quantity };
    });

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      items: fullItems,
      totalAmount: total,
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <StoreContext.Provider value={{ medicines, transactions, addMedicine, updateMedicine, deleteMedicine, processTransaction }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
