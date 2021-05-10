import { gql } from "graphql-request";
import { useMutation } from "react-query";

import { client } from "../../utils/graphQLClient";

const CREATE_ITEM = gql`
  mutation CreateItem($input: ItemInput!) {
    createItem(input: $input) {
      id
    }
  }
`;

const createItem = async variables => {
  const { createItem } = await client.request(CREATE_ITEM, variables);
  return createItem;
};

const useCreateItem = () => {
  return useMutation(newItem => createItem(newItem));
};

export { useCreateItem };
