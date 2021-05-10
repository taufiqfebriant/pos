import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_EDIT_ITEM = gql`
  query GetEditItem($where: ItemWhereInput!) {
    item(where: $where) {
      name
      price
    }
  }
`;

const editItemQueryKey = id => ["editItem", id];

const getEditItem = async ({ queryKey }) => {
  const [, id] = queryKey;

  const { item } = await client.request(GET_EDIT_ITEM, {
    where: { id: Number(id) },
  });
  return item;
};

const useEditItem = id => useQuery(editItemQueryKey(id), getEditItem);

export { editItemQueryKey, getEditItem, useEditItem };
