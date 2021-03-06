import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const UPDATE_SALE = gql`
  mutation UpdateSale($id: Int!, $input: [SaleInput!]!) {
    updateSale(id: $id, input: $input) {
      id
    }
  }
`;

const updateSale = async variables => {
  const { updateSale } = await client.request(UPDATE_SALE, variables);
  return updateSale;
};

const useUpdateSale = () => useMutation(newSale => updateSale(newSale));

export { useUpdateSale };
