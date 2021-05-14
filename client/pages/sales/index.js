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
import dayjs from "dayjs";
import NextLink from "next/link";
import { Fragment, useEffect } from "react";

import Header from "../../components/Header";
import HeaderTitle from "../../components/HeaderTitle";
import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import { useSales } from "../../hooks/sales/useSales";
import TdLink from "../../components/TdLink";

const initialVariables = { first: 10, orderBy: { id: "desc" } };

const Sales = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSales(initialVariables, {
      getNextPageParam: ({ pageInfo }) => {
        return pageInfo.hasNextPage && pageInfo.endCursor;
      },
    });

  useEffect(() => {
    console.log(data);
  }, [data]);

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
        {isLoading ? (
          <Center mt="4">
            <Spinner />
          </Center>
        ) : (
          <Box borderWidth="thin">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>No. Penjualan</Th>
                  <Th>Totaln</Th>
                  <Th>Dibuat pada</Th>
                  <Th>Diperbarui pada</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.pages.map((page, index) => (
                  <Fragment key={index}>
                    {page.edges.map(({ node }) => (
                      <Tr key={node.id} _hover={{ background: "teal.50" }}>
                        <TdLink href={`/sales/${node.id}`}>{node.id}</TdLink>
                        <TdLink href={`/sales/${node.id}`}>
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(node.total)}
                        </TdLink>
                        <TdLink href={`/sales/${node.id}`}>
                          {dayjs(Number(node.createdAt)).format(
                            "DD MMMM YYYY HH:mm:ss"
                          )}
                        </TdLink>
                        <TdLink href={`/sales/${node.id}`}>
                          {dayjs(Number(node.updatedAt)).format(
                            "DD MMMM YYYY HH:mm:ss"
                          )}
                        </TdLink>
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

Sales.getLayout = getLayout;

export default Sales;
