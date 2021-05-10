import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Sort {
    asc
    desc
  }

  input OrderByInput {
    id: Sort!
  }

  type Item {
    id: ID!
    name: String!
    price: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Sale {
    id: ID!
    createdAt: String!
    updatedAt: String!
    saleDetails: [SaleDetail!]!
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

  input SaleWhereInput {
    id: Int!
  }

  input SalesFilterInput {
    take: Int
    orderBy: OrderByInput
  }

  input ItemWhereInput {
    id: Int!
  }

  input ItemsFilterInput {
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
    items(filter: ItemsFilterInput): [Item!]
    sale(where: SaleWhereInput!): Sale
    sales(filter: SalesFilterInput): [Sale!]
    viewer: User
  }
`;
