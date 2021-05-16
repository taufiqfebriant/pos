import gql from "graphql-tag";

const Item = gql`
  type Item implements Node {
    id: ID!
    name: String!
    price: Int!
    createdAt: String!
    updatedAt: String!
  }

  type ItemEdge {
    cursor: String!
    node: Item!
  }

  type ItemConnection {
    edges: [ItemEdge]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input ItemInput {
    name: String!
    price: Int!
  }

  input ItemWhereInput {
    id: Int!
  }

  input ItemOrderByInput {
    createdAt: Sort!
  }

  type Mutation {
    createItem(input: ItemInput!): Item
    deleteItem(id: Int!): Boolean
    updateItem(id: Int!, input: ItemInput!): Item
  }

  type Query {
    item(where: ItemWhereInput!): Item
    items(first: Int, after: String, orderBy: ItemOrderByInput): ItemConnection
  }
`;

export default Item;
