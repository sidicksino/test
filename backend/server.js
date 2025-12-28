const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Routes ---

// 1. Get All Medicines
app.get('/api/medicines', async (req, res) => {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .order('name');
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Add New Medicine
app.post('/api/medicines', async (req, res) => {
  const { name, category, price, stock, expiryDate, minStockAlert } = req.body;
  
  const { data, error } = await supabase
    .from('medicines')
    .insert([{ name, category, price, stock, expiryDate, minStockAlert }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// 3. Update Medicine (e.g., Stock from POS or Edit)
app.patch('/api/medicines/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const { data, error } = await supabase
    .from('medicines')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 4. Delete Medicine
app.delete('/api/medicines/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('medicines')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// 5. Process Transaction
app.post('/api/transactions', async (req, res) => {
  const { items, totalAmount } = req.body; // items: [{ id, quantity }]
  
  // Start a Supabase RPC or handle manually. 
  // For simplicity here, we'll do it in steps. In prod, use a DB transaction/RPC.
  
  // A. Create Transaction Record
  const { data: txData, error: txError } = await supabase
    .from('transactions')
    .insert([{ total_amount: totalAmount }])
    .select()
    .single();
    
  if (txError) return res.status(500).json({ error: txError.message });
  const transactionId = txData.id;

  // B. Create Transaction Items & Update Stock
  const transactionItems = [];
  
  for (const item of items) {
    // 1. Get current stock
    const { data: med } = await supabase
      .from('medicines')
      .select('stock, name, price')
      .eq('id', item.id)
      .single();
      
    if (!med) continue;

    // 2. Insert into transaction_items
    transactionItems.push({
      transaction_id: transactionId,
      medicine_id: item.id,
      quantity: item.quantity,
      price_at_sale: med.price,
      medicine_name_snapshot: med.name 
    });

    // 3. Update stock
    await supabase
      .from('medicines')
      .update({ stock: med.stock - item.quantity })
      .eq('id', item.id);
  }

  // Batch insert items
  const { error: itemsError } = await supabase
    .from('transaction_items')
    .insert(transactionItems);

  if (itemsError) {
    // In a real app, you'd rollback here
    return res.status(500).json({ error: itemsError.message });
  }

  res.status(201).json({ message: 'Transaction successful', id: transactionId });
});

// 6. Get History
app.get('/api/transactions', async (req, res) => {
  // Fetch transactions with their items
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      transaction_items (
        quantity,
        price_at_sale,
        medicine_name_snapshot
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  
  // Transform for frontend
  const formatted = data.map(tx => ({
    id: tx.id,
    timestamp: tx.created_at,
    totalAmount: tx.total_amount,
    items: tx.transaction_items.map(item => ({
      name: item.medicine_name_snapshot,
      quantity: item.quantity,
      price: item.price_at_sale
    }))
  }));

  res.json(formatted);
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
