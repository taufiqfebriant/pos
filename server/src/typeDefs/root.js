import gql from "graphql-tag";

const Root = gql`
  enum Sort {
    asc
    desc
  }

  interface Node {
    id: ID!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }
`;

export default Root;
