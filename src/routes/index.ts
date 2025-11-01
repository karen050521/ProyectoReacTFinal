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

// ====== Profiles ======
const ProfileList = lazy(() => import('../pages/Profile/list'));
const ProfileCreate = lazy(() => import('../pages/Profile/create'));
const ProfileUpdate = lazy(() => import('../pages/Profile/update'));

// ====== Roles ======
const RoleList = lazy(() => import('../pages/Role/list'));
const RoleCreate = lazy(() => import('../pages/Role/create'));
const RoleUpdate = lazy(() => import('../pages/Role/update'));

// ====== Role Permissions ======
const RolePermissionList = lazy(() => import('../pages/RolePermission/list'));

// ====== User Roles ======
 const ManageUserRoles = lazy(() => import('../pages/UserRole/UserRoleManagementPage'));
 const AssignUserRole = lazy(() => import('../pages/UserRole/AssignUserRolePage'));

// ====== Sessions ======
const SessionList = lazy(() => import('../pages/session/list'));
const SessionCreate = lazy(() => import('../pages/session/create'));
const SessionUpdate = lazy(() => import('../pages/session/update'));

// ====== Passwords ======
const ListPassword = lazy(() => import('../pages/Password/list'));
const CreatePassword = lazy(() => import('../pages/Password/create'));
const UpdatePassword = lazy(() => import('../pages/Password/update'));

// ====== Permissions ======
const PermissionList = lazy(() => import('../pages/permission/list'));
const PermissionCreate = lazy(() => import('../pages/permission/create'));
const PermissionUpdate = lazy(() => import('../pages/permission/update'));

// ====== Address ======
//const AddressList = lazy(() => import('../pages/Address/list'));
const AddressCreate = lazy(() => import('../pages/Address/create'));
//const ListAddresses = lazy(() => import('../pages/Address/AddressPage'));
const CreateAddress = lazy(() => import('../pages/Address/CreateAddressPage'));
const UpdateAddress = lazy(() => import('../pages/Address/UpdateAddressPage'));

// ROLE (Color Amarillo - CRUD básico)
// TODO: Descommentar cuando se creen las páginas
// const ListRoles = lazy(() => import('../pages/Role/RoleListPage'));
// const CreateRole = lazy(() => import('../pages/Role/RoleCreatePage'));
// const UpdateRole = lazy(() => import('../pages/Role/RoleUpdatePage'));

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
  { path: '/users', title: 'Users', component: ListUsers },
  { path: '/users/create', title: 'Create User', component: CreateUser },
  { path: '/users/update/:id', title: 'Update User', component: UpdateUser },

  // Roles
  { path: '/roles', title: 'Roles', component: RoleList },
  { path: '/roles/create', title: 'Create Role', component: RoleCreate },
  { path: '/roles/update/:id', title: 'Update Role', component: RoleUpdate },

  // Role Permissions
  { path: '/role-permissions', title: 'Role Permissions', component: RolePermissionList },
  
  
    // USER ROLE Routes (N:N User <-> Role)
    {
      path: '/user-roles',
      title: 'User Role Management',
      component: ManageUserRoles,
    },
    {
      path: '/user-roles/assign',
      title: 'Assign User Role',
      component: AssignUserRole,
    }
    
 

  // Sessions
  { path: '/sessions', title: 'Sessions', component: SessionList },
  { path: '/sessions/create', title: 'Create Session', component: SessionCreate },
  { path: '/sessions/update/:id', title: 'Update Session', component: SessionUpdate },

  // Passwords // PASSWORD Routes (1:N User -> Password)
  { path: '/passwords', title: 'Password Management', component: ListPassword },
  { path: '/passwords/create', title: 'Create Password', component: CreatePassword },
  { path: '/passwords/update/:id', title: 'Update Password', component: UpdatePassword },

  // Permissions
  { path: '/permissions', title: 'Permissions', component: PermissionList },
  { path: '/permissions/create', title: 'Create Permission', component: PermissionCreate },
  { path: '/permissions/update/:id', title: 'Update Permission', component: PermissionUpdate },

  // Addresses
  //{ path: '/addresses', title: 'Addresses', component: ListAddresses },
  { path: '/addresses/create', title: 'Create Address', component: CreateAddress },
  { path: '/addresses/update/:id', title: 'Update Address', component: UpdateAddress },
  { path: '/addresses/user/:userId', title: 'Address', component: AddressCreate },
  
  // USER ROLE Routes (N:N User <-> Role)
  {
    path: '/user-roles',
    title: 'User Role Management',
    component: ManageUserRoles,
  },
  {
    path: '/user-roles/assign',
    title: 'Assign User Role',
    component: AssignUserRole,
  }
  // ===== COLOR AMARILLO ROUTES =====
  // TODO: Descommentar cuando se creen las páginas correspondientes
  /*{
    path: '/addresses/:id',
    title: 'Address Detail',
    component: DetailAddress,
  },
  
  */
];

const routes = [...coreRoutes];
export default routes;
