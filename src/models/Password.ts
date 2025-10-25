
export interface Password {
    id?: number;
  user_id: number;
  content: string;
  startAt: string; // ISO
  endAt?: string | null;
  created_at?: string;
  updated_at?: string;
}

