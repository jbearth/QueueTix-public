import jwt_decode from 'jwt-decode';

export const tokenAccessDecoded = () => {
  return jwt_decode(localStorage.getItem("accesstoken") as string)
}
export const tokenRefreshDecoded = () => {
  return jwt_decode(localStorage.getItem("refreshtoken") as string);
}