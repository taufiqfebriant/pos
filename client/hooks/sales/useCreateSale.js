import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const CREATE_SALE = gql`
  mutation CreateSale($input: [SaleDetailInput!]!) {
    createSale(input: $input) {
      id
    }
  }
`;

const createSale = async variables => {
  const { createSale } = await client.request(CREATE_SALE, variables);
  return createSale;
};

const useCreateSale = () => {
  return useMutation(newSale => createSale(newSale));
};

export { useCreateSale };
