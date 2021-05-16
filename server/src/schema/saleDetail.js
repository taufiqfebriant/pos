import gql from "graphql-tag";

const SaleDetail = gql`
  type SaleDetail implements Node {
    id: ID!
    amount: Int!
    unitPrice: Int!
    item: Item!
    total: Int!
  }
`;

export default SaleDetail;
