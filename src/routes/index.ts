import { lazy } from 'react';

// Core pages
const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

// Users
const ListUsers = lazy(() => import('../pages/Users/list'));
const CreateUser = lazy(() => import('../pages/Users/create'));
const UpdateUser = lazy(() => import('../pages/Users/update'));

// Profile
const Profile = lazy(() => import('../pages/Profile'));
const ProfileList = lazy(() => import('../pages/Profile/list'));
const ProfileCreate = lazy(() => import('../pages/Profile/create'));
const ProfileUpdate = lazy(() => import('../pages/Profile/update'));

// Roles
const RoleList = lazy(() => import('../pages/Role/list'));
const RoleCreate = lazy(() => import('../pages/Role/create'));
const RoleUpdate = lazy(() => import('../pages/Role/update'));

// RolePermission
const RolePermissionList = lazy(() => import('../pages/RolePermission/list'));
//const RolePermissionCreate = lazy(() => import('../pages/RolePermission/create'));

// UserRole
const UserRoleList = lazy(() => import('../pages/UserRole/list'));
const UserRoleCreate = lazy(() => import('../pages/UserRole/create'));
const UserRoleUpdate = lazy(() => import('../pages/UserRole/update'));

// Sessions
const SessionList = lazy(() => import('../pages/session/list'));
const SessionCreate = lazy(() => import('../pages/session/create'));
const SessionUpdate = lazy(() => import('../pages/session/update'));

// Passwords
const PasswordList = lazy(() => import('../pages/Password/list'));
const PasswordCreate = lazy(() => import('../pages/Password/create'));
const PasswordUpdate = lazy(() => import('../pages/Password/update'));

// Permissions
const PermissionList = lazy(() => import('../pages/permission/list'));
const PermissionCreate = lazy(() => import('../pages/permission/create'));
const PermissionUpdate = lazy(() => import('../pages/permission/update'));

// Address
const AddressList = lazy(() => import('../pages/Address/list'));
const AddressCreate = lazy(() => import('../pages/Address/create'));


// Dashboard examples
const Profile2 = lazy(() => import('../pages/Profile2'));

const coreRoutes = [
  { path: '/calendar', 
    title: 'Calendar',
    component: Calendar },

  { path: '/chart', 
    title: 'Chart', 
    component: Chart },

  { path: '/forms/form-elements', 
    title: 'Form Elements', 
    component: FormElements },

  { path: '/forms/form-layout', 
    title: 'Form Layouts', 
    component: FormLayout },

  { path: '/tables', 
    title: 'Tables', 
    component: Tables },

  { path: '/settings', 
    title: 'Settings', 
    component: Settings },

  { path: '/ui/alerts', 
    title: 'Alerts', 
    component: Alerts },

  { path: '/ui/buttons', 
    title: 'Buttons', 
    component: Buttons },

  // Users
  { path: '/users', 
    title: 'Users', 
    component: ListUsers },

  { path: '/users/create', 
    title: 'Create User', 
    component: CreateUser },

  { path: '/users/update/:id', 
    title: 'Update User', 
    component: UpdateUser },

  // Profiles
  { path: '/profiles', 
    title: 'Profiles', 
    component: ProfileList },

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

  { path: '/roles/create', 
    title: 'Create Role', 
    component: RoleCreate },

  { path: '/roles/update/:id', 
    title: 'Update Role', 
    component: RoleUpdate },

  // RolePermissions
  { path: '/role-permissions', 
    title: 'Role Permissions', 
    component: RolePermissionList },

  //{ path: '/role-permissions/create', 
   // title: 'Create Role Permission', 
   // component: RolePermissionCreate },

  // UserRole
  { path: '/user-roles', 
    title: 'User Roles', 
    component: UserRoleList },

  { path: '/user-roles/create', 
    title: 'Create UserRole', 
    component: UserRoleCreate },
  

  { path: '/user-roles/update/:id', 
    title: 'Update UserRole', 
    component: UserRoleUpdate },

  // Sessions
  { path: '/sessions', 
    title: 'Sessions', 
    component: SessionList },

  { path: '/sessions/create', 
    title: 'Create Session', 
    component: SessionCreate },

  { path: '/sessions/update/:id', 
    title: 'Update Session', 
    component: SessionUpdate },

  // Passwords
  { path: '/passwords', 
    title: 'Passwords', 
    component: PasswordList },
  { path: '/passwords/create', 
    title: 'Create Password', 
    component: PasswordCreate },
  { path: '/passwords/update/:id', 
    title: 'Update Password', 
    component: PasswordUpdate },

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

  // Address
  { path: '/addresses/user/:userId',
    title: 'Address',
    component: AddressCreate },
    
  { path: '/addresses', 
    title: 'Addresses', 
    component: AddressList },

  // Misc / examples
  { path: '/profile2', 
    title: 'Profile v2', 
    component: Profile2 },

];

const routes = [...coreRoutes];
export default routes;
