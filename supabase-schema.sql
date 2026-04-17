-- Nook Database Schema
-- Execute este SQL no Supabase SQL Editor

-- Limpar tabelas existentes (ordem inversa por causa das foreign keys)
drop table if exists tasks cascade;
drop table if exists lists cascade;

-- Listas de tarefas
create table lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  color text,
  created_at timestamptz default now()
);

-- Tarefas
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  list_id uuid references lists on delete cascade,
  title text not null,
  description text,
  completed boolean default false,
  pomodoros_completed int default 0,
  difficulty int default 25,
  estimated_time int default 60,
  start_date timestamptz default now(),
  deadline timestamptz,
  scheduled_time int,
  created_at timestamptz default now()
);

-- Row Level Security
alter table lists enable row level security;
alter table tasks enable row level security;

-- Drop existing policies (para evitar erro de duplicação)
drop policy if exists "Users can view own lists" on lists;
drop policy if exists "Users can create own lists" on lists;
drop policy if exists "Users can update own lists" on lists;
drop policy if exists "Users can delete own lists" on lists;

drop policy if exists "Users can view own tasks" on tasks;
drop policy if exists "Users can create own tasks" on tasks;
drop policy if exists "Users can update own tasks" on tasks;
drop policy if exists "Users can delete own tasks" on tasks;

-- Policies para lists
create policy "Users can view own lists"
  on lists for select
  using (auth.uid() = user_id);

create policy "Users can create own lists"
  on lists for insert
  with check (auth.uid() = user_id);

create policy "Users can update own lists"
  on lists for update
  using (auth.uid() = user_id);

create policy "Users can delete own lists"
  on lists for delete
  using (auth.uid() = user_id);

-- Policies para tasks
create policy "Users can view own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can create own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on tasks for delete
  using (auth.uid() = user_id);
