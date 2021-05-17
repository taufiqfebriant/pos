import { gql } from "graphql-request";
import { useInfiniteQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_ITEMS = gql`
  query GetItems($first: Int, $after: String, $orderBy: ItemOrderByInput) {
    items(first: $first, after: $after, orderBy: $orderBy) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const getItems = async ({ queryKey, pageParam }) => {
  const [, variables] = queryKey;

  const { items } = await client.request(GET_ITEMS, {
    ...variables,
    after: pageParam,
  });

  return items;
};

const getItemsKey = variables => ["items", variables];

const useItems = (variables, options) => {
  return useInfiniteQuery(getItemsKey(variables), getItems, options);
};

export { useItems };
