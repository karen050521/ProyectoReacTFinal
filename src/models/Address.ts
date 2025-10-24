export interface Address {
  id?: number;
  user_id?: number;
  street: string;
  number: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
}