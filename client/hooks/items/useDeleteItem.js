import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const DELETE_ITEM = gql`
  mutation DeleteItem($id: Int!) {
    deleteItem(id: $id)
  }
`;

const deleteItem = async variables => {
  const { deleteItem } = await client.request(DELETE_ITEM, variables);
  return deleteItem;
};

const useDeleteItem = () => useMutation(sale => deleteItem(sale));

export { deleteItem, useDeleteItem };
