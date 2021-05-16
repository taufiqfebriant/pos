import gql from "graphql-tag";

const Auth = gql`
  input LoginInput {
    username: String!
    password: String!
  }

  type Mutation {
    login(input: LoginInput!): Boolean
    logout: Boolean
  }

  type Query {
    viewer: User
  }
`;

export default Auth;
