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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Header from "../../components/Header";
import HeaderBackButton from "../../components/HeaderBackButton";
import HeaderTitle from "../../components/HeaderTitle";
import { getLayout } from "../../components/Layout";
import Title from "../../components/Title";
import { schema } from "../../schema/item";
import { useCreateItem } from "../../hooks/items/useCreateItem";

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
              <Controller
                defaultValue={0}
                control={control}
                name="price"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { invalid },
                }) => (
                  <NumberInput
                    onBlur={onBlur}
                    onChange={onChange}
                    defaultValue={value}
                    variant="filled"
                    isInvalid={invalid}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
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
