import gql from "graphql-tag";

const Sale = gql`
  type Sale implements Node {
    id: ID!
    createdAt: String!
    updatedAt: String!
    saleDetails: [SaleDetail!]!
    total: Int!
  }

  type SaleEdge {
    cursor: String!
    node: Sale!
  }

  type SaleConnection {
    edges: [SaleEdge]!
    pageInfo: PageInfo!
    totalCount: Int!
    totalSum: Int!
    totalItems: Int!
  }

  input SaleInput {
    itemId: Int!
    amount: Int!
  }

  input SaleWhereInput {
    id: Int!
  }

  input SaleOrderByInput {
    id: Sort!
  }

  type Mutation {
    createSale(input: [SaleInput!]!): Sale
    deleteSale(id: Int!): Boolean
    updateSale(id: Int!, input: [SaleInput!]!): Sale
  }

  type Query {
    sale(where: SaleWhereInput!): Sale
    sales(
      first: Int
      after: String
      orderBy: SaleOrderByInput
      gte: String
      lt: String
    ): SaleConnection
  }
`;

export default Sale;
