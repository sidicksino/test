-- Create Medicines Table
create table medicines (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text,
  price numeric not null,
  stock integer not null default 0,
  "expiryDate" date, -- Quoted to preserve CamelCase if desired, or use snake_case
  "minStockAlert" integer default 10
);

-- Create Transactions Table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  total_amount numeric not null
);

-- Create Transaction Items Link Table
create table transaction_items (
  id uuid default gen_random_uuid() primary key,
  transaction_id uuid references transactions(id) on delete cascade,
  medicine_id uuid references medicines(id),
  quantity integer not null,
  price_at_sale numeric not null,
  medicine_name_snapshot text -- Store name in case medicine is deleted later
);

-- Enable RLS (Optional but recommended)
alter table medicines enable row level security;
alter table transactions enable row level security;
alter table transaction_items enable row level security;

-- Create Policies (Public for now for simplicity, restrict in prod)
create policy "Public Access" on medicines for all using (true);
create policy "Public Access" on transactions for all using (true);
create policy "Public Access" on transaction_items for all using (true);
