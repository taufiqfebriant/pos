import { gql } from "graphql-request";

import { client } from "../../utils/graphQLClient";

const GET_LATEST_SALES = gql`
  query GetLatestSales($filter: SalesFilterInput) {
    sales(filter: $filter) {
      id
    }
  }
`;

const getLatestSales = async ({ queryKey }) => {
  const [, take, orderBy] = queryKey;

  const { sales } = await client.request(GET_LATEST_SALES, {
    filter: {
      take,
      orderBy,
    },
  });
  return sales;
};

export { getLatestSales };
