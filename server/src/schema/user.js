import gql from "graphql-tag";

const User = gql`
  type User implements Node {
    id: ID!
    username: String!
    name: String!
  }
`;

export default User;
