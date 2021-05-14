import {
  Box,
  Button,
  Center,
  Link,
  Spinner,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Fragment } from "react";

import { useItems } from "../../hooks/items/useItems";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import HeaderTitle from "../../components/HeaderTitle";
import TdLink from "../../components/TdLink";

const initialVariables = { first: 10, orderBy: { createdAt: "desc" } };

const Items = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useItems(initialVariables, {
      getNextPageParam: ({ pageInfo }) => {
        return pageInfo.hasNextPage && pageInfo.endCursor;
      },
    });

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
        {isLoading ? (
          <Center mt="4">
            <Spinner />
          </Center>
        ) : (
          <Box borderWidth="thin">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>No. Barang</Th>
                  <Th>Nama Barang</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.pages.map((page, index) => (
                  <Fragment key={index}>
                    {page.edges.map(({ node }) => (
                      <Tr key={node.id} _hover={{ background: "teal.50" }}>
                        <TdLink href={`/items/${node.id}`}>{node.id}</TdLink>
                        <TdLink href={`/items/${node.id}`}>{node.name}</TdLink>
                      </Tr>
                    ))}
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
        {isFetchingNextPage && (
          <Center mt="4">
            <Spinner />
          </Center>
        )}
        {hasNextPage && (!isLoading || !isFetchingNextPage) && (
          <Center mt="4">
            <Button onClick={fetchNextPage}>Muat lebih banyak</Button>
          </Center>
        )}
      </Box>
    </>
  );
};

Items.getLayout = getLayout;

export default Items;
