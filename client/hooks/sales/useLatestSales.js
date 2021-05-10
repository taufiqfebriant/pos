import { gql } from "graphql-request";

import { client } from "../../utils/graphQLClient";

const GET_LATEST_SALES = gql`
  query GetLatestSales($filter: SalesFilterInput) {
    sales(filter: $filter) {
      id
    }
  }
`;

const getLatestSalesKey = "latestSales";

const getLatestSales = async ({ queryKey }) => {
  const [, filter] = queryKey;

  const { sales } = await client.request(GET_LATEST_SALES, { filter });
  return sales;
};

export { getLatestSales, getLatestSalesKey };
