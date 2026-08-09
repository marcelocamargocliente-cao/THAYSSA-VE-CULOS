import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kvywklyujlnkotnckivd.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2eXdrbHl1amxua290bmNraXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODczMDUsImV4cCI6MjEwMTg2MzMwNX0.i85qTUxpUJiOK_09HIIIik1-k4UUCpIBrid54cJK-jo';
export const SUPABASE_SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2eXdrbHl1amxua290bmNraXZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI4NzMwNSwiZXhwIjoyMTAxODYzMzA1fQ.r6xOZosUxLhv53O0lzHGbJ_8LAWfJ3W1GR1Kboc6fNI';
export const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE);

export interface VehicleDB {
  id: string;
  nome: string;
  tipo: 'carro' | 'moto' | 'suv' | 'pickup' | 'outro';
  marca: string;
  modelo: string;
  ano: number;
  km: number;
  preco: number;
  preco_exibicao: string;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  foto_url: string | null;
  whatsapp_msg: string;
}

export interface GaleriaDB {
  id: string;
  titulo: string | null;
  foto_url: string;
  ordem: number;
  ativo: boolean;
}
