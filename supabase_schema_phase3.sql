-- Feedback Table
create table public.feedback (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  order_id uuid null, -- Optional link to order
  rating integer not null check (rating >= 1 and rating <= 5),
  comments text null,
  tags text[] null, -- e.g. ['spicy', 'tasty']
  constraint feedback_pkey primary key (id)
);

-- Offers Table (For logging/persistence, though we use Realtime for broadcast)
create table public.offers (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  message text not null,
  is_active boolean not null default true,
  constraint offers_pkey primary key (id)
);

-- Enable Realtime for Offers (Critical for Flash Deals)
alter publication supabase_realtime add table public.offers;

-- RLS Policies
alter table public.feedback enable row level security;
alter table public.offers enable row level security;

create policy "Enable insert for feedback" on public.feedback for insert to public with check (true);
create policy "Enable read for offers" on public.offers for select to public using (true);
create policy "Enable insert for offers" on public.offers for insert to public with check (true);
