import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_EDIT_SALE = gql`
  query GetEditSale($where: SaleWhereInput!) {
    sale(where: $where) {
      total
      saleDetails {
        amount
        unitPrice
        item {
          id
          name
        }
      }
    }
  }
`;

const getEditSaleKey = id => ["editSale", id];

const getEditSale = async ({ queryKey }) => {
  const [, id] = queryKey;

  const { sale } = await client.request(GET_EDIT_SALE, {
    where: { id: parseInt(id) },
  });
  return sale;
};

const useEditSale = id => useQuery(getEditSaleKey(id), getEditSale);

export { getEditSaleKey, useEditSale };
