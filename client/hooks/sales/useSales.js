import { gql } from "graphql-request";
import { useInfiniteQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_SALES = gql`
  query GetSales($first: Int, $after: String, $orderBy: SaleOrderByInput) {
    sales(first: $first, after: $after, orderBy: $orderBy) {
      edges {
        node {
          id
          createdAt
          updatedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const getSales = async ({ queryKey, pageParam }) => {
  const [, variables] = queryKey;

  const { sales } = await client.request(GET_SALES, {
    ...variables,
    after: pageParam,
  });

  return sales;
};

const getSalesKey = variables => ["sales", variables];

const useSales = (variables, options) => {
  return useInfiniteQuery(getSalesKey(variables), getSales, options);
};

export { getSales, getSalesKey, useSales };
