import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const ITEM_SEARCH = gql`
  query ItemSearch($first: Int, $where: ItemsWhereInput) {
    items(first: $first, where: $where) {
      edges {
        node {
          id
          name
          price
        }
      }
    }
  }
`;

const getItemSearchKey = variables => ["itemSearch", variables];

const getItemSearch = async ({ queryKey }) => {
  const [, variables] = queryKey;

  const { items } = await client.request(ITEM_SEARCH, variables);
  return items;
};

const useItemSearch = (variables, options) => {
  return useQuery(getItemSearchKey(variables), getItemSearch, options);
};

export { useItemSearch };
