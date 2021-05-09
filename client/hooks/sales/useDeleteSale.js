import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const DELETE_SALE = gql`
  mutation DeleteSale($id: Int!) {
    deleteSale(id: $id)
  }
`;

const deleteSale = async variables => {
  const { deleteSale } = await client.request(DELETE_SALE, variables);
  return deleteSale;
};

const useDeleteSale = () => {
  return useMutation(sale => deleteSale(sale));
};

export { deleteSale, useDeleteSale };
