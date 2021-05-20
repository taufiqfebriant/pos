import { Box, Center, Heading, HStack, Spinner } from "@chakra-ui/react";
import dayjs from "dayjs";
import { MdAttachMoney } from "react-icons/md";
import { VscGraph, VscPackage } from "react-icons/vsc";

import Header from "../components/Header";
import InfoCard from "../components/InfoCard";
import HeaderTitle from "../components/HeaderTitle";
import Title from "../components/Title";
import { getLayout } from "../components/Layout";
import { useDashboardInfo } from "../hooks/dashboard/useDashboardInfo";
import { abbreviateNumber } from "../utils/helpers";

const today = dayjs();

const Dashboard = () => {
  const { data, isLoading } = useDashboardInfo({
    gte: today.format("YYYY-MM-DD"),
    lt: today.add(1, "day").format("YYYY-MM-DD"),
  });

  return (
    <>
      <Title title="Dasbor"></Title>
      <Header>
        <HeaderTitle>Dasbor</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        <Heading size="lg">Penjualan hari ini</Heading>
        {isLoading ? (
          <Center mt="4">
            <Spinner />
          </Center>
        ) : (
          <HStack mt="4">
            <InfoCard
              icon={VscGraph}
              title={data.sales.totalCount}
              description="Penjualan"
            />
            <InfoCard
              icon={VscPackage}
              title={data.sales.totalItems}
              description="Barang terjual"
            />
            <InfoCard
              icon={MdAttachMoney}
              title={`Rp${abbreviateNumber(data.sales.totalSum)}`}
              description="Total pemasukan"
            />
          </HStack>
        )}
      </Box>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
