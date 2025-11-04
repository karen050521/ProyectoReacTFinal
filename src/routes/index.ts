import { lazy } from 'react';

// ====== Pages ======
const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Profile = lazy(() => import('../pages/Profile'));
const Profile2 = lazy(() => import('../pages/Profile2'));

// ====== Form ======
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));

// ====== UI Elements ======
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

// ====== Users ======
const ListUsers = lazy(() => import('../pages/Users/list'));
const CreateUser = lazy(() => import('../pages/Users/create'));
const UpdateUser = lazy(() => import('../pages/Users/update'));
const ViewUser = lazy(() => import('../pages/Users/view'));

// ====== Profiles ======
const ProfileList = lazy(() => import('../pages/Profile/list'));
const ProfileCreate = lazy(() => import('../pages/Profile/create'));
const ProfileUpdate = lazy(() => import('../pages/Profile/update'));
const UserProfile = lazy(() => import('../pages/Profile/userProfile'));

// ====== Roles ======
const RoleList = lazy(() => import('../pages/Role/RolePage'));
const RoleCreate = lazy(() => import('../pages/Role/CreateRolePage'));
const RoleUpdate = lazy(() => import('../pages/Role/UpdateRolePage'));

// ====== Role Permissions ======
const RolePermissionList = lazy(() => import('../pages/RolePermission/list'));

// ====== User Roles ======
const UserRoleList = lazy(() => import('../pages/UserRole/UserRolePage'));
const AssignUserRole = lazy(() => import('../pages/UserRole/AssignUserRolePage'));
const UpdateUserRole = lazy(() => import('../pages/UserRole/UpdateUserRolePage'));

// ====== Sessions ======
const SessionList = lazy(() => import('../pages/session/list'));
const SessionCreate = lazy(() => import('../pages/session/create'));
const SessionUpdate = lazy(() => import('../pages/session/update'));
const UserSessions = lazy(() => import('../pages/session/userSessions'));

// ====== Passwords ======
const PasswordList = lazy(() => import('../pages/Password/PasswordPage'));
const PasswordCreate = lazy(() => import('../pages/Password/CreatePasswordPage'));
const PasswordUpdate = lazy(() => import('../pages/Password/UpdatePasswordPage'));

// ====== Permissions ======
const PermissionList = lazy(() => import('../pages/permission/list'));
const PermissionCreate = lazy(() => import('../pages/permission/create'));
const PermissionUpdate = lazy(() => import('../pages/permission/update'));

// ====== Address ======
// Address pages (Material UI - CRUD Completo con mapas)
const ListAddresses = lazy(() => import('../pages/Address/AddressPage'));
const CreateAddress = lazy(() => import('../pages/Address/CreateAddressPage'));
const UpdateAddress = lazy(() => import('../pages/Address/UpdateAddressPage'));
const ViewAddress = lazy(() => import('../pages/Address/AddressViewPage'));

// Microsoft OAuth
const MicrosoftAuthPage = lazy(() => import('../pages/Authentication/MicrosoftAuthPage'));

// USER ROLE (Color Amarillo - Asignación N:N)
// TODO: Descommentar cuando se creen las páginas
// const ManageUserRoles = lazy(() => import('../pages/UserRole/UserRoleManagementPage'));
// const AssignUserRole = lazy(() => import('../pages/UserRole/AssignUserRolePage'));

// ====== Routes ======
const coreRoutes = [
  // General
  { path: '/calendar', title: 'Calendar', component: Calendar },
  { path: '/chart', title: 'Chart', component: Chart },
  { path: '/tables', title: 'Tables', component: Tables },
  { path: '/settings', title: 'Settings', component: Settings },

  // Forms
  { path: '/forms/form-elements', title: 'Form Elements', component: FormElements },
  { path: '/forms/form-layout', title: 'Form Layouts', component: FormLayout },

  // UI
  { path: '/ui/alerts', title: 'Alerts', component: Alerts },
  { path: '/ui/buttons', title: 'Buttons', component: Buttons },

  // Profile
  { path: '/profile', title: 'Profile', component: Profile },
  { path: '/profile2', title: 'Profile v2', component: Profile2 },
  { path: '/profiles', title: 'Profiles', component: ProfileList },
  { path: '/profiles/create', title: 'Create Profile', component: ProfileCreate },
  { path: '/profiles/update/:id', title: 'Update Profile', component: ProfileUpdate },

  // Users
  { path: '/users', 
    title: 'Users', 
    component: ListUsers },

  { path: '/users/create', 
    title: 'Create User', 
    component: CreateUser },

  { path: '/users/view/:id', 
    title: 'View User', 
    component: ViewUser },

  { path: '/users/update/:id', 
    title: 'Update User', 
    component: UpdateUser },

  // Profiles
  { path: '/profiles', 
    title: 'Profiles', 
    component: ProfileList },

  { path: '/profiles/user/:userId', 
    title: 'User Profile', 
    component: UserProfile },

  { path: '/profiles/create', 
    title: 'Create Profile', 
    component: ProfileCreate },

  { path: '/profiles/update/:id', 
    title: 'Update Profile', 
    component: ProfileUpdate },

  { path: '/profile', 
    title: 'Profile', 
    component: Profile },

  // Roles
  { path: '/roles', title: 'Roles', component: RoleList },
  { path: '/roles/create', title: 'Create Role', component: RoleCreate },
  { path: '/roles/update/:id', title: 'Update Role', component: RoleUpdate },

  // Role Permissions
  { path: '/role-permissions', title: 'Role Permissions', component: RolePermissionList },
  
  // User Roles
  { path: '/user-roles', title: 'User Role Management', component: UserRoleList },
  { path: '/user-roles/assign', title: 'Assign User Role', component: AssignUserRole },
  { path: '/user-roles/update/:id', title: 'Update User Role', component: UpdateUserRole },
 

  // Sessions
  { path: '/sessions', title: 'Sessions', component: SessionList },
  { path: '/sessions/create', title: 'Create Session', component: SessionCreate },
  { path: '/sessions/update/:id', title: 'Update Session', component: SessionUpdate },

  // Passwords // PASSWORD Routes (1:N User -> Password)
  { path: '/passwords', title: 'Password Management', component: PasswordList },
  { path: '/passwords/create', title: 'Create Password', component: PasswordCreate },
  { path: '/passwords/update/:id', title: 'Update Password', component: PasswordUpdate },



  { path: '/sessions/user/:userId', 
    title: 'User Sessions', 
    component: UserSessions },

  { path: '/sessions/create', 
    title: 'Create Session', 
    component: SessionCreate },

  { path: '/sessions/update/:id', 
    title: 'Update Session', 
    component: SessionUpdate },

  // Permissions
  { path: '/permissions', 
    title: 'Permissions', 
    component: PermissionList },
  { path: '/permissions/create', 
    title: 'Create Permission', 
    component: PermissionCreate },
  { path: '/permissions/update/:id', 
    title: 'Update Permission', 
    component: PermissionUpdate },

   // Addresses (Material UI con mapas interactivos)
  { path: '/addresses', title: 'Mi Dirección', component: ListAddresses },
  { path: '/addresses/create', title: 'Crear Dirección', component: CreateAddress },
  { path: '/addresses/update/:id', title: 'Editar Dirección', component: UpdateAddress },
  { path: '/addresses/view/:id', title: 'Ver Dirección', component: ViewAddress },

  // Microsoft OAuth
  { path: '/auth/microsoft',
    title: 'Microsoft OAuth',
    component: MicrosoftAuthPage },

  // Misc / examples
  { path: '/profile2', 
    title: 'Profile v2', 
    component: Profile2 },

];

const routes = [...coreRoutes];
export default routes;
