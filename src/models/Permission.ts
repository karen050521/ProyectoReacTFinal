export interface Permission {
  id: number;
  url: string;
  method: string;
  entity: string;
  created_at?: string;
  updated_at?: string;
}