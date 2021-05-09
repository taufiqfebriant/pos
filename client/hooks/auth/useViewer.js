import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      name
    }
  }
`;

const getViewer = async () => {
  const { viewer } = await client.request(GET_VIEWER);
  return viewer;
};

const useViewer = () => {
  return useQuery("viewer", getViewer);
};

export { getViewer, useViewer };
