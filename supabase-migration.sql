-- Nook Migration - Adicionar novos campos à tabela tasks
-- Execute este SQL no Supabase SQL Editor se você já criou a tabela tasks anteriormente

-- Adicionar coluna difficulty (nível de dificuldade 0-100)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS difficulty int DEFAULT 25;

-- Adicionar coluna estimated_time (tempo estimado em minutos)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_time int DEFAULT 60;

-- Adicionar coluna start_date (data de início)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date timestamptz DEFAULT now();

-- Adicionar coluna deadline (prazo)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline timestamptz;

