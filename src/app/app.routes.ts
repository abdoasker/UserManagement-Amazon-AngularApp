

import { Routes } from '@angular/router';
import { Notfound } from './notfound/notfound.js';

import { Register } from './register/register.js';
import { Login } from './login/login.js';
import { authGuard } from './guards/auth-guard.js';
import { ConfirmEmail } from './confirm-email/confirm-email.js';
import { ConfirmEmailSuccess } from './confirm-email-success/confirm-email-success.js';
import { Home } from './home/home.js';
import { ResetPassword } from './reset-password/reset-password.js';
import { Profile } from './profile/profile.js';
import { Users } from './users/users.js';
import { AdminGuard } from './guards/admin-guard.js';
import { Roles } from './roles/roles.js';
import { Permissions } from './permissions/permissions.js';
import { UserActivities } from './logs/user-activities/user-activities.js';
import { UserLogins } from './logs/user-logins/user-logins.js';
import { UsersActivities } from './logs/users-activities/users-activities.js';
import { RolesActivities } from './logs/roles-activities/roles-activities.js';
import { GoogleSigninSuccess } from './google-signin-success/google-signin-success.js';
import { UsersLogins } from './logs/users-logins/users-logins.js';

export const routes: Routes = [
  { path: '', redirectTo: 'account/login', pathMatch: 'full' },

  { path: 'account/register', component: Register },
  { path: 'account/login', component: Login },
  { path: 'account/confirm-email', component: ConfirmEmail },
  { path: 'account/reset-password', component: ResetPassword },
  { path: 'account/google-signin-success', component: GoogleSigninSuccess },
  {
    path: 'account/confirm-email-success',
    component: ConfirmEmailSuccess,
    canActivate: [authGuard],
  },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  {
    path: 'admin/users',
    component: Users,
    canActivate: [authGuard, AdminGuard],
  },
  {
    path: 'admin/roles',
    component: Roles,
    canActivate: [authGuard, AdminGuard],
  },
  {
    path: 'admin/logs/user-activities',
    component: UsersActivities,
    canActivate: [authGuard, AdminGuard],
  },
  {
    path: 'admin/logs/user-activities/:userId',
    component: UserActivities,
    canActivate: [authGuard, AdminGuard],
  },
  {
    path: 'admin/logs/user-logins',
    component: UsersLogins,
    canActivate: [authGuard, AdminGuard],
  },
  {
    path: 'admin/logs/user-logins/:userId',
    component: UserLogins,
    canActivate: [authGuard, AdminGuard],
  },
  {
    path: 'admin/logs/roles-activities',
    component: RolesActivities,
    canActivate: [authGuard, AdminGuard],
  },
  {
    path: 'admin/permissions',
    component: Permissions,
    canActivate: [authGuard, AdminGuard],
  },

  { path: '**', component: Notfound },
];




//this routes delleted authGuard and AdminGuard for testing purposes


// import { Routes } from '@angular/router';
// import { Notfound } from './notfound/notfound.js';

// import { Register } from './register/register.js';
// import { Login } from './login/login.js';
// import { ConfirmEmail } from './confirm-email/confirm-email.js';
// import { ConfirmEmailSuccess } from './confirm-email-success/confirm-email-success.js';
// import { GoogleSigninSuccess } from './google-signin-success/google-signin-success.js';

// import { Home } from './home/home.js';
// import { Profile } from './profile/profile.js';

// import { Users } from './users/users.js';
// import { Roles } from './roles/roles.js';
// import { Permissions } from './permissions/permissions.js';

// import { UsersActivities } from './logs/users-activities/users-activities.js';
// import { UserActivities } from './logs/user-activities/user-activities.js';
// import { UsersLogins } from './logs/users-logins/users-logins.js';
// import { UserLogins } from './logs/user-logins/user-logins.js';
// import { RolesActivities } from './logs/roles-activities/roles-activities.js';

// export const routes: Routes = [
//   // الصفحة الرئيسية
//   { path: '', redirectTo: 'home', pathMatch: 'full' },

//   // Account Pages (بدون أي تحقق)
//   { path: 'account/register', component: Register },
//   { path: 'account/login', component: Login },
//   { path: 'account/confirm-email', component: ConfirmEmail },
//   { path: 'account/confirm-email-success', component: ConfirmEmailSuccess },
//   { path: 'account/google-signin-success', component: GoogleSigninSuccess },

//   // Pages عامة
//   { path: 'home', component: Home },
//   { path: 'profile', component: Profile },

//   // Admin Pages (بس كصفحات عادية)
//   { path: 'admin/users', component: Users },
//   { path: 'admin/roles', component: Roles },
//   { path: 'admin/permissions', component: Permissions },

//   // Logs
//   { path: 'admin/logs/user-activities', component: UsersActivities },
//   { path: 'admin/logs/user-activities/:userId', component: UserActivities },

//   { path: 'admin/logs/user-logins', component: UsersLogins },
//   { path: 'admin/logs/user-logins/:userId', component: UserLogins },

//   { path: 'admin/logs/roles-activities', component: RolesActivities },

//   // Not Found
//   { path: '**', component: Notfound },
// ];
