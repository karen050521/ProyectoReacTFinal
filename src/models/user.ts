import { Address } from "./Address";
import { Profile } from "./Profile";
import { Password } from "./Password";
import { Session } from "./Session";
import { UserRole } from "./UserRole";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { RolePermission } from "./RolePermission";    

export interface User {
  id?: number;
  _id?: string; // Para compatibilidad con respuestas de API que usan _id
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  profile?: Profile | null;
  address?: Address | null;
  passwords?: Password[];
  sessions?: Session[];
  user_roles?: UserRole[];
  roles?: Role[]; // optional if sending nested roles
  permissions?: Permission[]; // optional if sending nested permissions
  role_permissions?: RolePermission[]; // optional
}