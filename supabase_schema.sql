-- Create the orders table
create table public.orders (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  customer_name text null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending'::text,
  payment_method text null,
  constraint orders_pkey primary key (id)
);

-- Enable Realtime
alter publication supabase_realtime add table public.orders;

-- Policies (Simple public access for demo purposes, restrict in production)
alter table public.orders enable row level security;

create policy "Enable read access for all users"
on public.orders
as permissive
for select
to public
using (true);

create policy "Enable insert for all users"
on public.orders
as permissive
for insert
to public
with check (true);

create policy "Enable update for all users"
on public.orders
as permissive
for update
to public
using (true);
