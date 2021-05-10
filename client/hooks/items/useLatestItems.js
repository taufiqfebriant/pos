import { gql } from "graphql-request";

import { client } from "../../utils/graphQLClient";

const GET_LATEST_ITEMS = gql`
  query GetLatestItems($filter: ItemsFilterInput) {
    items(filter: $filter) {
      id
    }
  }
`;

const getLatestItemsKey = filter => ["latestItems", filter];

const getLatestItems = async ({ queryKey }) => {
  const [, filter] = queryKey;

  const { items } = await client.request(GET_LATEST_ITEMS, { filter });
  return items;
};

export { getLatestItemsKey, getLatestItems };
