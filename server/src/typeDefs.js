import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Sort {
    asc
    desc
  }

  input OrderByInput {
    id: Sort!
  }

  interface Node {
    id: ID!
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean!
  }

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

  input ItemOrderByInput {
    createdAt: Sort!
  }

  input ItemWhereInput {
    id: Int!
  }

  type Sale implements Node {
    id: ID!
    createdAt: String!
    updatedAt: String!
    saleDetails: [SaleDetail!]!
  }

  type SaleEdge {
    cursor: String!
    node: Sale!
    total: Int!
  }

  type SaleConnection {
    edges: [SaleEdge]!
    pageInfo: PageInfo!
  }

  input SaleOrderByInput {
    id: Sort!
  }

  input SaleWhereInput {
    id: Int!
  }

  type SaleDetail {
    id: ID!
    amount: Int!
    unitPrice: Int!
    item: Item!
  }

  type User {
    id: ID!
    username: String!
    name: String!
  }

  input ItemInput {
    name: String!
    price: Int!
  }

  input SaleDetailInput {
    itemId: Int!
    amount: Int!
  }

  input SalesFilterInput {
    take: Int
    orderBy: OrderByInput
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Mutation {
    createSale(input: [SaleDetailInput!]!): Sale
    deleteSale(id: Int!): Boolean
    updateSale(id: Int!, input: [SaleDetailInput!]!): Sale
    login(input: LoginInput): Boolean
    logout: Boolean
    createItem(input: ItemInput!): Item
    deleteItem(id: Int!): Boolean
    updateItem(id: Int!, input: ItemInput!): Item
  }

  type Query {
    item(where: ItemWhereInput!): Item
    items(first: Int, after: String, orderBy: ItemOrderByInput): ItemConnection
    sale(where: SaleWhereInput!): Sale
    sales(first: Int, after: String, orderBy: SaleOrderByInput): SaleConnection
    viewer: User
  }
`;
