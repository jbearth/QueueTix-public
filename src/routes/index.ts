import { useReducer } from 'react';
import { useRoutes } from 'react-router-dom';

import { useAuth } from '../data/Auth';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { checkTokenExist } = useAuth();
    const isAuthenticated = localStorage.hasOwnProperty("accesstoken") || localStorage.hasOwnProperty("refreshtoken")
    checkTokenExist();
    if (!isAuthenticated) {
        // console.log("isAuthenticated ", isAuthenticated)
        return useRoutes([AuthenticationRoutes]);
    } else {
        // console.log("isAuthenticated ", isAuthenticated)
        return useRoutes([MainRoutes, AuthenticationRoutes]);
    }
}
