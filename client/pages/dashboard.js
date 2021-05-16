import Header from "../components/Header";
import HeaderTitle from "../components/HeaderTitle";
import Title from "../components/Title";
import { getLayout } from "../components/Layout";

const Dashboard = () => {
  return (
    <>
      <Title title="Dasbor"></Title>
      <Header>
        <HeaderTitle>Dasbor</HeaderTitle>
      </Header>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
