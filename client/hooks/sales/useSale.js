import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_SALE = gql`
  query GetSale($where: SaleWhereInput!) {
    sale(where: $where) {
      id
      createdAt
      updatedAt
      saleDetails {
        id
        amount
        unitPrice
        item {
          name
        }
        total
      }
      total
    }
  }
`;

const getSale = async ({ queryKey }) => {
  const [, id] = queryKey;

  const { sale } = await client.request(GET_SALE, {
    where: { id: parseInt(id) },
  });
  return sale;
};

const getSaleKey = id => ["sales", id];

const useSale = id => useQuery(getSaleKey(id), getSale);

export { getSale, getSaleKey, useSale };
