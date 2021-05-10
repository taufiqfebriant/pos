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

const getItems = async ({ queryKey }) => {
  const [, filter] = queryKey;

  const { items } = await client.request(GET_ITEMS, { filter });
  return items;
};

const useItems = filter => {
  return useQuery(["items", filter], getItems);
};

export { getItems, useItems };
