import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const UPDATE_ITEM = gql`
  mutation UpdateItem($id: Int!, $input: ItemInput!) {
    updateItem(id: $id, input: $input) {
      id
    }
  }
`;

const updateItem = async variables => {
  const { updateItem } = await client.request(UPDATE_ITEM, variables);
  return updateItem;
};

const useUpdateItem = () => useMutation(newItem => updateItem(newItem));

export { useUpdateItem };
