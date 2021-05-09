import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_ITEM = gql`
  query GetItem($where: ItemWhereInput!) {
    item(where: $where) {
      name
      price
      createdAt
      updatedAt
    }
  }
`;

const getItem = async ({ queryKey }) => {
  const [, id] = queryKey;

  const { item } = await client.request(GET_ITEM, {
    where: { id: Number(id) },
  });
  return item;
};

const useItem = id => {
  return useQuery(["items", id], getItem);
};

export { getItem, useItem };
