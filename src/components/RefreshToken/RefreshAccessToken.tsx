import React, { useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

import jwt_decode from 'jwt-decode';
import { tokenVerify } from "../../utils/tokenVerify";
import { useAuth } from "../../data/Auth";

const refresh_AccessToken = gql`
  mutation Mutation($token: String!) {
    refreshAccessToken(token: $token) {
      token {
        access_token
      }
      error {
        message
      }
    }
  }
`;

function RefreshAccessToken() {
  const [Mutation, { data, error, loading }] = useMutation(refresh_AccessToken);

  const {checkTokenExist} = useAuth()


  let token_refresh: any
  useEffect(() => {
    // Check token exists
    checkTokenExist()
    if (localStorage.getItem("accesstoken")) {
      // Token Expires Verify
      token_refresh  = tokenVerify()
      if (token_refresh != "accesstoken not expires yet") {
        // refresh Access Token
        Mutation({
          variables: { token: token_refresh },
        });
      }
    }
  }, [])

  // if data is found, set new access token 
  if(data) {
    localStorage.setItem('accesstoken', data.refreshAccessToken.token.access_token);
  }

  return (
    <></>
  )
}

export default RefreshAccessToken