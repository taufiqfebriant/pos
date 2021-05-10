import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { VscEdit, VscEllipsis, VscTrash } from "react-icons/vsc";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

import DeleteAlert from "../../../components/DeleteAlert";
import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";
import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { useDeleteItem } from "../../../hooks/items/useDeleteItem";
import { getItem, useItem } from "../../../hooks/items/useItem";
import { getLatestItems } from "../../../hooks/items/useLatestItems";

const Item = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data } = useItem(router.query.id);

  const {
    mutateAsync: deleteItem,
    isLoading: deleteItemIsLoading,
  } = useDeleteItem();

  const deleteAction = async () => {
    const success = await deleteItem({ id: parseInt(router.query.id) });
    if (success) router.push("/items");
  };

  return (
    <>
      <Title title={data.name} />
      <DeleteAlert
        title="Hapus Barang"
        isLoading={deleteItemIsLoading}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteAction={deleteAction}
      />
      <Header>
        <HeaderBackButton href="/items" />
        <HeaderTitle>Detail Barang</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        <Flex align="center" justify="space-between">
          <Heading size="lg">{data.name}</Heading>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<VscEllipsis />}
              variant="ghost"
              color="gray.600"
              fontSize="2xl"
              _hover={{ bg: "gray.100", color: "green.500" }}
              _active={{ bg: "gray.100", color: "green.500" }}
            />
            <MenuList>
              <NextLink href={`/items/${data.id}/edit`} passHref>
                <Link _hover={{ textDecoration: "none" }}>
                  <MenuItem icon={<VscEdit />}>Edit</MenuItem>
                </Link>
              </NextLink>
              <MenuItem
                icon={<VscTrash />}
                color="red.500"
                onClick={() => setIsOpen(true)}
              >
                Hapus
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
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
