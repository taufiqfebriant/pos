import { gql } from "graphql-request";

import { client } from "../../utils/graphQLClient";

const GET_LATEST_ITEMS = gql`
  query GetLatestItems($first: Int, $orderBy: ItemOrderByInput) {
    items(first: $first, orderBy: $orderBy) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const getLatestItems = async ({ queryKey }) => {
  const [, variables] = queryKey;

  const { items } = await client.request(GET_LATEST_ITEMS, variables);
  return items;
};

const getLatestItemsKey = variables => ["latestItems", variables];

export { getLatestItems, getLatestItemsKey };
