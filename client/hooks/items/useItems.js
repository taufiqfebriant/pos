import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_ITEMS = gql`
  query GetItems($filter: ItemsFilterInput) {
    items(filter: $filter) {
      id
      name
    }
  }
`;

const getItemsKey = filter => ["items", filter];

const getItems = async ({ queryKey }) => {
  const [, filter] = queryKey;

  const { items } = await client.request(GET_ITEMS, { filter });
  return items;
};

const useItems = filter => useQuery(getItemsKey(filter), getItems);

export { getItemsKey, getItems, useItems };
