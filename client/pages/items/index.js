import {
  Box,
  Button,
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
import NextLink from "next/link";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

import { getItems, getItemsKey, useItems } from "../../hooks/items/useItems";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import HeaderTitle from "../../components/HeaderTitle";

const Items = () => {
  const { data } = useItems({ orderBy: { id: "desc" } });

  return (
    <>
      <Title title="Barang" />
      <Header justify="space-between">
        <HeaderTitle>Barang</HeaderTitle>
        <NextLink href="/items/create" passHref>
          <Link _hover={{ textDecoration: "none" }}>
            <Button>Tambah Barang</Button>
          </Link>
        </NextLink>
      </Header>
      <Box as="main" px="4" py="3">
        <Box borderWidth="thin">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>No. Barang</Th>
                <Th>Nama Barang</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(item => (
                <Tr key={item.id} _hover={{ background: "teal.50" }}>
                  <Td p="0">
                    <LinkBox py="4" px="6">
                      <NextLink href={`/items/${item.id}`} passHref>
                        <LinkOverlay>{item.id}</LinkOverlay>
                      </NextLink>
                    </LinkBox>
                  </Td>
                  <Td p="0">
                    <LinkBox py="4" px="6">
                      <NextLink href={`/items/${item.id}`} passHref>
                        <LinkOverlay>{item.name}</LinkOverlay>
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
    [getItemsKey, { orderBy: { id: "desc" } }],
    getItems
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

Items.getLayout = getLayout;

export default Items;
