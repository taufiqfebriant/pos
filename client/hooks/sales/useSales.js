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

const getSales = async ({ queryKey }) => {
  const [, orderBy] = queryKey;

  const { sales } = await client.request(GET_SALES, {
    filter: {
      orderBy,
    },
  });
  return sales;
};

const useSales = orderBy => {
  return useQuery(["sales", orderBy], getSales);
};

export { getSales, useSales };
