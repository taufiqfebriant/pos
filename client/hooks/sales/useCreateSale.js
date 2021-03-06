import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const CREATE_SALE = gql`
  mutation CreateSale($input: [SaleInput!]!) {
    createSale(input: $input) {
      id
    }
  }
`;

const createSale = async variables => {
  const { createSale } = await client.request(CREATE_SALE, variables);
  return createSale;
};

const useCreateSale = () => useMutation(newSale => createSale(newSale));

export { useCreateSale };
