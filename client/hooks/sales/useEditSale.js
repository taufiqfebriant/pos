import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_EDIT_SALE = gql`
  query GetEditSale($where: SaleWhereInput!) {
    sale(where: $where) {
      saleDetails {
        amount
        item {
          id
        }
      }
    }
  }
`;

const getEditSale = async ({ queryKey }) => {
  const [, , id] = queryKey;

  const { sale } = await client.request(GET_EDIT_SALE, {
    where: { id: Number(id) },
  });
  return sale;
};

const useEditSale = id => {
  return useQuery(["sales", "edit", id], getEditSale);
};

export { getEditSale, useEditSale };
