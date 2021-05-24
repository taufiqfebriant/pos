import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Spinner,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import NextLink from "next/link";

import Header from "../../components/Header";
import HeaderTitle from "../../components/HeaderTitle";
import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import { useSales } from "../../hooks/sales/useSales";
import { mediaQueries } from "../../utils/mediaQueries";

const initialVariables = { first: 10, orderBy: { id: "desc" } };

const Sales = () => {
  const [isSm] = useMediaQuery(mediaQueries.sm);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSales(initialVariables, {
      getNextPageParam: ({ pageInfo }) => {
        return pageInfo.hasNextPage && pageInfo.endCursor;
      },
    });

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
          <Center>
            <Spinner />
          </Center>
        ) : (
          data.pages.map((page, index) => (
            <Grid
              templateColumns="repeat(auto-fit, minmax(325px, 1fr))"
              gap="2"
              key={index}
              pb={!isSm && "14"}
            >
              {page.edges.length
                ? page.edges.map(({ node }) => (
                    <LinkBox key={node.id}>
                      <Flex
                        justify="space-between"
                        align="center"
                        borderWidth="thin"
                        p="4"
                      >
                        <Box>
                          <Heading size="md">
                            <NextLink href={`/sales/${node.id}`} passHref>
                              <LinkOverlay>#{node.id}</LinkOverlay>
                            </NextLink>
                          </Heading>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontWeight="medium"
                          >
                            {dayjs(Number(node.createdAt)).format(
                              "DD MMMM YYYY HH:mm"
                            )}
                          </Text>
                        </Box>
                        <Heading size="md">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(node.total)}
                        </Heading>
                      </Flex>
                    </LinkBox>
                  ))
                : "tidak ada data"}
            </Grid>
          ))
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
