import { RolePermission } from "./RolePermission";

export interface Role {
  id?: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  role_permissions?: RolePermission[];
}
