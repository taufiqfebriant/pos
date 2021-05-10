import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import NextLink from "next/link";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

import Header from "../../components/Header";
import HeaderTitle from "../../components/HeaderTitle";
import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import { getSales, getSalesKey, useSales } from "../../hooks/sales/useSales";

const Sales = () => {
  const { data } = useSales({ orderBy: { id: "desc" } });

  return (
    <>
      <Title title="Penjualan" />
      <Header justify="space-between">
        <HeaderTitle>Penjualan</HeaderTitle>
        <NextLink href="/sales/create" passHref>
          <Link _hover={{ textDecoration: "none" }}>
            <Button>Tambah Penjualan</Button>
          </Link>
        </NextLink>
      </Header>
      <Box as="main" px="4" py="3">
        <Box borderWidth="thin">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>No. Penjualan</Th>
                <Th>Diperbarui pada</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(sale => (
                <Tr key={sale.id} _hover={{ background: "teal.50" }}>
                  <Td p="0">
                    <LinkBox py="4" px="6">
                      <NextLink href={`/sales/${sale.id}`} passHref>
                        <LinkOverlay>{sale.id}</LinkOverlay>
                      </NextLink>
                    </LinkBox>
                  </Td>
                  <Td p="0">
                    <LinkBox py="4" px="6">
                      <NextLink href={`/sales/${sale.id}`} passHref>
                        <LinkOverlay>
                          {dayjs(Number(sale.updatedAt)).format(
                            "DD MMMM YYYY HH:mm:ss"
                          )}
                        </LinkOverlay>
                      </NextLink>
                    </LinkBox>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </>
  );
};

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    getSalesKey({ orderBy: { id: "desc" } }),
    getSales
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

Sales.getLayout = getLayout;

export default Sales;
