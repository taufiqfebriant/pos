import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const logout = async () => {
  const { logout } = await client.request(LOGOUT);
  return logout;
};

const useLogout = () => {
  return useMutation(logout);
};

export { useLogout };
