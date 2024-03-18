import React, { useContext, createContext, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";

import {
  tokenAccessDecoded,
  tokenRefreshDecoded
} from '../utils/tokenDecoded';
import { Box } from '@mui/system';
import { CircularProgress } from '@mui/material';

const GETAMUSEMENTPARK = gql`
  query GetAmusementParkAll {
    GetAmusementParkAll {
      id
    }
  }
`;


//ค่าเริ่มต้น
const initialstate = {
  user: null,
};

if (localStorage.getItem("accesstoken")) {
  const token_access_decoded: any = tokenAccessDecoded()
  const token_refresh_decoded: any = tokenRefreshDecoded()
  // console.log(token_access_decoded)
  // if refresh token is not expire
  if (token_refresh_decoded.exp * 1000 > Date.now()) {
    initialstate.user = token_access_decoded
  }
}

const AuthReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "SETAUTHEN":
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    default:
      return state;
  }
};

// type AuthContextType = {
//   user: any;
//   login: (userData: any) => void;
//   logout: () => void;
//   checkTokenExist: () => null;
// };

const AuthContext = createContext({
  user: null,
  login: (userData: any, token: any) => { },
  logout: () => { },
  checkTokenExist: () => { },
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(AuthReducer, initialstate);

  const {
    loading: queryAmusementParkloading,
    error: queryAmusementParkError,
    data: queryAmusementParkData
  } = useQuery(GETAMUSEMENTPARK)

  if (queryAmusementParkloading) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <CircularProgress size={80} disableShrink />
      </Box >
    )
  }

  const login = async (userData: any, token: any) => {
    console.log(userData)
    localStorage.setItem('users', JSON.stringify(userData));
    localStorage.setItem('accesstoken', token.access_token);
    localStorage.setItem('refreshtoken', token.refresh_token);
    localStorage.setItem('id_amusementpark', queryAmusementParkData.GetAmusementParkAll[0].id);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
    window.location.assign("/dashboard/general/app")
  };

  const logout = () => {
    localStorage.clear();
    window.location.assign("/login")
    console.log("logout")
    dispatch({ action: "LOGOUT" });
  };

  const checkTokenExist = () => {
    const location = useLocation()

    if (!localStorage.hasOwnProperty("accesstoken") || !localStorage.hasOwnProperty("refreshtoken")) {
      console.log("Clear")
      localStorage.clear()
    }

    // console.log("pass: ", state.user);
    if (state.user === null && location.pathname !== "/pages/dashboard/login") {
      window.location.assign("/pages/dashboard/login")
    }

    // console.log(state?.user, " | ")
  };
  // console.log("auth: ", isAuthenticated)

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout, checkTokenExist }}>
      {children}
    </AuthContext.Provider>
  );
};