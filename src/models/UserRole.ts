import { Role } from "./Role";
import { User } from "./user";

export interface UserRole {
   id?: string; // UUID
  user_id: number;
  role_id: number;
  startAt: string; // ISO
  endAt?: string | null;
  created_at?: string;
  updated_at?: string;
}
