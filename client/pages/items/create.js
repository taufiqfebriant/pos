import { Alert, AlertIcon, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import Header from "../../components/Header";
import HeaderBackButton from "../../components/HeaderBackButton";
import HeaderTitle from "../../components/HeaderTitle";
import { getLayout } from "../../components/Layout";
import Title from "../../components/Title";
import { useCreateItem } from "../../hooks/items/useCreateItem";
import ItemForm from "../../components/ItemForm";

const CreateItem = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { mutateAsync, isLoading } = useCreateItem();

  const onSubmit = async input => {
    try {
      const { id } = await mutateAsync({ input });
      if (id) router.push(`/items/${id}`);
    } catch (err) {
      const {
        response: { errors },
      } = JSON.parse(JSON.stringify(err));

      setError(errors[0].message);
    }
  };

  return (
    <>
      <Title title="Tambah Barang" />
      <Header>
        <HeaderBackButton href="/items" />
        <HeaderTitle>Tambah Barang</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        {error && (
          <Alert status="error" mb="4">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <ItemForm
          defaultValues={{
            name: "",
            price: 0,
          }}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </Box>
    </>
  );
};

CreateItem.getLayout = getLayout;

export default CreateItem;
