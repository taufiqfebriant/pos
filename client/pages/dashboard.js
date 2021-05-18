import {
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { MdAttachMoney } from "react-icons/md";
import { VscGraph, VscPackage } from "react-icons/vsc";

import Header from "../components/Header";
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
            <HStack
              borderWidth="thin"
              flex="1"
              py="3"
              px="4"
              borderRadius="base"
              align="center"
              spacing="3"
            >
              <Icon as={VscGraph} boxSize="8" />
              <Box>
                <Heading fontSize="2xl">{data.sales.totalCount}</Heading>
                <Text>Penjualan</Text>
              </Box>
            </HStack>
            <HStack
              borderWidth="thin"
              flex="1"
              py="3"
              px="4"
              borderRadius="base"
              align="center"
              spacing="3"
            >
              <Icon as={VscPackage} boxSize="8" />
              <Box>
                <Heading fontSize="2xl">{data.sales.totalItems}</Heading>
                <Text>Barang terjual</Text>
              </Box>
            </HStack>
            <HStack
              borderWidth="thin"
              flex="1"
              py="3"
              px="4"
              borderRadius="base"
              align="center"
              spacing="3"
            >
              <Icon as={MdAttachMoney} boxSize="8" />
              <Box>
                <Heading fontSize="2xl">
                  Rp{abbreviateNumber(data.sales.totalSum)}
                </Heading>
                <Text>Total pemasukan</Text>
              </Box>
            </HStack>
          </HStack>
        )}
      </Box>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
