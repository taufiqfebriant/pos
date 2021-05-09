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
      }
    }
  }
`;

const getSale = async ({ queryKey }) => {
  const [, id] = queryKey;

  const { sale } = await client.request(GET_SALE, {
    where: { id: Number(id) },
  });
  return sale;
};

const useSale = id => {
  return useQuery(["sales", id], getSale);
};

export { getSale, useSale };