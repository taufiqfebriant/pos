import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { client } from "../../utils/graphQLClient";

const GET_DASHBOARD_INFO = gql`
  query GetDashboardInfo($gte: String, $lt: String) {
    sales(gte: $gte, lt: $lt) {
      totalCount
      totalSum
      totalItems
    }
  }
`;

const getDashboardInfo = async ({ queryKey }) => {
  const [, variables] = queryKey;

  const response = await client.request(GET_DASHBOARD_INFO, variables);
  return response;
};

const useDashboardInfo = variables => {
  return useQuery(["dashboardInfo", variables], getDashboardInfo);
};

export { useDashboardInfo };
