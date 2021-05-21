import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Header from "../../components/Header";
import HeaderBackButton from "../../components/HeaderBackButton";
import HeaderTitle from "../../components/HeaderTitle";
import NumberInput from "../../components/NumberInput";
import { getLayout } from "../../components/Layout";
import Title from "../../components/Title";
import { schema } from "../../schema/item";
import { useCreateItem } from "../../hooks/items/useCreateItem";

const NumberInputProps = {
  variant: "filled",
};

const CreateItem = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="name" d="flex" isInvalid={errors.name}>
            <FormLabel mt="2" mb="0" mr="0" w={1 / 8}>
              Nama
            </FormLabel>
            <Box w={7 / 8}>
              <Input variant="filled" {...register("name")} />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </Box>
          </FormControl>
          <FormControl id="price" isInvalid={errors.price} d="flex" mt="4">
            <FormLabel mt="2" mb="0" mr="0" w={1 / 8}>
              Harga
            </FormLabel>
            <Box w={7 / 8}>
              <NumberInput
                control={control}
                name="price"
                defaultValue={0}
                inputProps={NumberInputProps}
              />
              <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
            </Box>
          </FormControl>
          <Flex justify="flex-end">
            <Button type="submit" mt="6" isLoading={isSubmitting || isLoading}>
              Simpan
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

CreateItem.getLayout = getLayout;

export default CreateItem;
