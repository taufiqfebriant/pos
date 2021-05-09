import { Heading } from "@chakra-ui/react";
import Title from "../components/Title";
import { getLayout } from "../components/Layout";

const Dashboard = () => {
  return (
    <>
      <Title>Dasbor</Title>
      <Heading size="lg">Dasbor</Heading>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
