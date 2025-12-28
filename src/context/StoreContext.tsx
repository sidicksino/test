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

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
// 2. Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medsRes, txRes] = await Promise.all([
        fetch('http://localhost:3000/api/medicines'),
        fetch('http://localhost:3000/api/transactions')
      ]);

      const medsData = await medsRes.json();
      const txData = await txRes.json();

      setMedicines(medsData);
      setTransactions(txData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const addMedicine = async (medicine: Medicine) => {
    try {
      // Omit ID since database generates it
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...newMed } = medicine;
      
      const res = await fetch('http://localhost:3000/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed)
      });
      const savedMed = await res.json();
      setMedicines(prev => [...prev, savedMed]);
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  const updateMedicine = async (id: string, updated: Partial<Medicine>) => {
    try {
      const res = await fetch(`http://localhost:3000/api/medicines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const updatedMed = await res.json();
      setMedicines(prev => prev.map(m => m.id === id ? updatedMed : m));
    } catch (error) {
       console.error("Error updating medicine:", error);
    }
  };

  const deleteMedicine = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/medicines/${id}`, { method: 'DELETE' });
      setMedicines(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const processTransaction = async (cartItems: { id: string; quantity: number }[], total: number) => {
    try {
       const res = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, totalAmount: total })
      });
      
      if (res.ok) {
        // Refresh entire state to ensure accurate stock and history
        fetchData();
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
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
