import { gql } from "graphql-request";

import { client } from "../../utils/graphQLClient";

const GET_LATEST_ITEMS = gql`
  query GetLatestItems($filter: ItemsFilterInput) {
    items(filter: $filter) {
      id
    }
  }
`;

const getLatestItems = async ({ queryKey }) => {
  const [, take, orderBy] = queryKey;

  const { items } = await client.request(GET_LATEST_ITEMS, {
    filter: {
      take,
      orderBy,
    },
  });
  return items;
};

export { getLatestItems };
