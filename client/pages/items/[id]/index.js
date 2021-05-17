import { Box, Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import DeleteAlert from "../../../components/DeleteAlert";
import DetailOptions from "../../../components/DetailOptions";
import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";
import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { useDeleteItem } from "../../../hooks/items/useDeleteItem";
import { useItem } from "../../../hooks/items/useItem";

const Item = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data, isLoading: itemIsLoading } = useItem(router.query.id);

  const { mutateAsync, isLoading: deleteItemIsLoading } = useDeleteItem();

  const deleteItem = async () => {
    const success = await mutateAsync({ id: parseInt(router.query.id) });
    if (success) router.push("/items");
  };

  return (
    <>
      <Title title={data?.name} />
      <DeleteAlert
        title="Hapus Barang"
        isLoading={deleteItemIsLoading}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteAction={deleteItem}
      />
      <Header>
        <HeaderBackButton href="/items" />
        <HeaderTitle>Detail Barang</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        {itemIsLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Flex align="center" justify="space-between">
              <Heading size="lg">{data.name}</Heading>
              <DetailOptions
                editHref={`/items/${data.id}/edit`}
                onDeleteClick={() => setIsOpen(true)}
              />
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
          </>
        )}
      </Box>
    </>
  );
};

Item.getLayout = getLayout;

export default Item;
