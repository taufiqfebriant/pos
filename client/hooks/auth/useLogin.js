import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`;

const login = async variables => {
  const { login } = await client.request(LOGIN, variables);
  return login;
};

const useLogin = () => {
  return useMutation(input => login(input));
};

export { useLogin };
