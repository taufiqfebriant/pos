import { Box, Heading } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

import Header from "../../../components/Header";
import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { getItem, useItem } from "../../../hooks/items/useItem";
import { getLatestItems } from "../../../hooks/items/useLatestItems";

const Item = () => {
  const router = useRouter();

  const { data } = useItem(router.query.id);

  return (
    <>
      <Title title="" />
      <Header>
        <Heading fontSize="2xl">Detail Barang</Heading>
      </Header>
      <Box as="main" px="4" py="3">
        <Heading size="lg">{data.name}</Heading>
        <Box as="dl" d="flex" flexWrap="wrap" mt="4">
          <Box as="dd" w={1 / 5} fontWeight="medium">
            Harga
          </Box>
          <Box as="dt" w={4 / 5} color="gray.600">
            {new Intl.NumberFormat("id", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(data.price)}
          </Box>
          <Box as="dd" w={1 / 5} fontWeight="medium" mt="1">
            Dibuat pada
          </Box>
          <Box as="dt" w={4 / 5} color="gray.600" mt="1">
            {dayjs(Number(data.createdAt)).format("DD MMMM YYYY HH:mm:ss")}
          </Box>
          <Box as="dd" w={1 / 5} fontWeight="medium" mt="1">
            Diperbarui pada
          </Box>
          <Box as="dt" w={4 / 5} color="gray.600" mt="1">
            {dayjs(Number(data.updatedAt)).format("DD MMMM YYYY HH:mm:ss")}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export const getStaticPaths = async () => {
  const queryClient = new QueryClient();

  const latestItems = await queryClient.fetchQuery(
    ["latestItems", 10, { id: "desc" }],
    getLatestItems
  );

  const paths = latestItems.map(sale => ({
    params: { id: sale.id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["items", id], getItem);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

Item.getLayout = getLayout;

export default Item;
