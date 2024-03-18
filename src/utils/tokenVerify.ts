import jwt_decode from 'jwt-decode';
import {
  tokenAccessDecoded,
  tokenRefreshDecoded
} from './tokenDecoded';

export const tokenVerify = () => {
  const token_check = ""
  const token_access_decoded: any = tokenAccessDecoded()
  const token_refresh_decoded: any = tokenRefreshDecoded()
  const token_refresh: string | null = localStorage.getItem("refreshtoken");
  // console.log(token_access_decoded.exp * 1000);
  // console.log(Date.now());
  // console.log(token_refresh_decoded.exp * 1000);

  if (token_access_decoded.exp * 1000 < Date.now() && token_refresh_decoded.exp * 1000 > Date.now()) {
    return token_refresh
  } else if (token_access_decoded.exp * 1000 < Date.now() && token_refresh_decoded.exp * 1000 < Date.now()) {
    // console.log("clear token")
    localStorage.clear()
  }

  return "accesstoken not expires yet";
};