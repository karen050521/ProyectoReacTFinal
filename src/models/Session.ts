import { User } from "./user";

export interface Session {
  id?: string; // UUID
  user_id: number;
  token: string;
  expiration: string; // ISO
  FACode?: string | null;
  state: string;
  created_at?: string;
  updated_at?: string;
}
