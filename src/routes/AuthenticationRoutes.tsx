import React, { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
const AuthLogin = Loadable(lazy(() => import('pages/Signin')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //
const AuthenticationRoutes = {
  path: '/pages/dashboard/login',
  element: <AuthLogin />
};

export default AuthenticationRoutes;
