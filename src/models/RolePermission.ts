
export interface RolePermission {
  id?: string; // UUID
  role_id: number;
  permission_id: number;
  created_at?: string;
  updated_at?: string;
}
