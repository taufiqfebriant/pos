import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
    }
  }
`;

const getItems = async () => {
  const { items } = await client.request(GET_ITEMS);
  return items;
};

const useItems = () => {
  return useQuery("items", getItems);
};

export { getItems, useItems };
