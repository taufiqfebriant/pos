import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_SALES = gql`
  query GetSales($filter: SalesFilterInput) {
    sales(filter: $filter) {
      id
      updatedAt
    }
  }
`;

const getSalesKey = filter => ["sales", filter];

const getSales = async ({ queryKey }) => {
  const [, filter] = queryKey;

  const { sales } = await client.request(GET_SALES, { filter });
  return sales;
};

const useSales = filter => useQuery(getSalesKey(filter), getSales);

export { getSales, getSalesKey, useSales };
