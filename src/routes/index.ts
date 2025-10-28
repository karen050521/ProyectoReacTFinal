import { lazy } from 'react';

// Existing imports
const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

// Users (Color Azul - ya implementado)
const ListUsers = lazy(() => import('../pages/Users/list'));
const CreatetUser = lazy(() => import('../pages/Users/create'));
const UpdatetUser = lazy(() => import('../pages/Users/update'));
// Address pages (Color Amarillo - CRUD)
const ListAddresses = lazy(() => import('../pages/Address/list'));
const CreateAddress = lazy(() => import('../pages/Address/create'));
const UpdateAddress = lazy(() => import('../pages/Address/update'));

// ADDRESS (Color Amarillo - CRUD completo)
// TODO: Descommentar cuando se creen las páginas
// const ListAddresses = lazy(() => import('../pages/Address/AddressListPage'));
// const CreateAddress = lazy(() => import('../pages/Address/AddressCreatePage'));
// const UpdateAddress = lazy(() => import('../pages/Address/AddressUpdatePage'));
// const DetailAddress = lazy(() => import('../pages/Address/AddressDetailPage'));

// PASSWORD (Color Amarillo - Historial por usuario)
// TODO: Descommentar cuando se creen las páginas
// const ListPasswords = lazy(() => import('../pages/Password/PasswordListPage'));
// const CreatePassword = lazy(() => import('../pages/Password/PasswordCreatePage'));
// const PasswordHistory = lazy(() => import('../pages/Password/PasswordHistoryPage'));

// ROLE (Color Amarillo - CRUD básico)
// TODO: Descommentar cuando se creen las páginas
// const ListRoles = lazy(() => import('../pages/Role/RoleListPage'));
// const CreateRole = lazy(() => import('../pages/Role/RoleCreatePage'));
// const UpdateRole = lazy(() => import('../pages/Role/RoleUpdatePage'));

// USER ROLE (Color Amarillo - Asignación N:N)
// TODO: Descommentar cuando se creen las páginas
// const ManageUserRoles = lazy(() => import('../pages/UserRole/UserRoleManagementPage'));
// const AssignUserRole = lazy(() => import('../pages/UserRole/AssignUserRolePage'));

const coreRoutes = [
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
  {
    path: '/users',
    title: 'Users',
    component: ListUsers,
  },
  {
    path: '/users/create',
    title: 'Create User',
    component: CreatetUser,
  },
  {
    path: '/users/update/:id',
    title: 'Update User',
    component: UpdatetUser,
  },
  // Address routes
  {
    path: '/addresses',
    title: 'Addresses',
    component: ListAddresses,
  },
  {
    path: '/addresses/create',
    title: 'Create Address',
    component: CreateAddress,
  },
  {
    path: '/addresses/update/:id',
    title: 'Update Address',
    component: UpdateAddress,
  },
  
  // ===== COLOR AMARILLO ROUTES =====
  // TODO: Descommentar cuando se creen las páginas correspondientes
  /*
  // ADDRESS Routes (1:1 con User)
  {
    path: '/addresses',
    title: 'Addresses',
    component: ListAddresses,
  },
  {
    path: '/addresses/create',
    title: 'Create Address',
    component: CreateAddress,
  },
  {
    path: '/addresses/update/:id',
    title: 'Update Address',
    component: UpdateAddress,
  },
  {
    path: '/addresses/:id',
    title: 'Address Detail',
    component: DetailAddress,
  },
  
  // PASSWORD Routes (1:N User -> Password)
  {
    path: '/passwords',
    title: 'Password Management',
    component: ListPasswords,
  },
  {
    path: '/passwords/create',
    title: 'Create Password',
    component: CreatePassword,
  },
  {
    path: '/passwords/history/:userId',
    title: 'Password History',
    component: PasswordHistory,
  },
  
  // ROLE Routes (entidad independiente)
  {
    path: '/roles',
    title: 'Roles',
    component: ListRoles,
  },
  {
    path: '/roles/create',
    title: 'Create Role',
    component: CreateRole,
  },
  {
    path: '/roles/update/:id',
    title: 'Update Role',
    component: UpdateRole,
  },
  
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
  */
  
];

const routes = [...coreRoutes];
export default routes;
