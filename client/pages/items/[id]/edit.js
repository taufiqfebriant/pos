import { Alert, AlertIcon, Box, Center, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQueryClient } from "react-query";

import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";
import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { getEditItemKey, useEditItem } from "../../../hooks/items/useEditItem";
import { useUpdateItem } from "../../../hooks/items/useUpdateItem";
import ItemForm from "../../../components/ItemForm";

const EditItem = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading: editItemIsLoading } = useEditItem(router.query.id);

  const { mutateAsync: updateItem, isLoading: updateItemIsLoading } =
    useUpdateItem();

  const onSubmit = async input => {
    try {
      const { id } = await updateItem({ id: parseInt(router.query.id), input });

      if (id) {
        await queryClient.invalidateQueries(getEditItemKey(id));
        router.push(`/items/${id}`);
      }
    } catch (err) {
      const {
        response: { errors },
      } = JSON.parse(JSON.stringify(err));

      setError(errors[0].message);
    }
  };

  return (
    <>
      <Title title="Edit Barang" />
      <Header>
        <HeaderBackButton href={`/items/${router.query.id}`} />
        <HeaderTitle>Edit Barang</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        {error && (
          <Alert status="error" mb="4">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {editItemIsLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : data ? (
          <ItemForm
            defaultValues={{
              name: data.name,
              price: data.price,
            }}
            isLoading={updateItemIsLoading}
            onSubmit={onSubmit}
            buttonText="Perbarui"
          />
        ) : (
          <Text align="center">Tidak ada data</Text>
        )}
      </Box>
    </>
  );
};

EditItem.getLayout = getLayout;

export default EditItem;
