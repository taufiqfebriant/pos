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

import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import { getSales, useSales } from "../../hooks/sales/useSales";

const Sales = () => {
  const { data } = useSales({ id: "desc" });

  return (
    <>
      <Title title="Penjualan" />
      <Flex align="center" justify="space-between">
        <Heading size="lg">Penjualan</Heading>
        <NextLink href="/sales/create" passHref>
          <Link _hover={{ textDecoration: "none" }}>
            <Button>Tambah Penjualan</Button>
          </Link>
        </NextLink>
      </Flex>
      <Box
        border="1px"
        borderColor="gray.100"
        borderRadius="base"
        mt="6"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead>
            <Tr bg="gray.50">
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
    </>
  );
};

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["sales", { id: "desc" }], getSales);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

Sales.getLayout = getLayout;

export default Sales;
