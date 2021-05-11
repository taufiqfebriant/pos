import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_ITEMS = gql`
  query GetItems($filter: ItemsFilterInput) {
    items(filter: $filter) {
      id
      name
      price
    }
  }
`;

const getItemsKey = "items";

const getItems = async ({ queryKey }) => {
  let filter;
  if (Array.isArray(queryKey)) {
    [, filter] = queryKey;
  }

  const { items } = await client.request(GET_ITEMS, filter && { filter });
  return items;
};

const useItems = filter =>
  useQuery(filter ? [getItemsKey, filter] : getItemsKey, getItems);

export { getItemsKey, getItems, useItems };
