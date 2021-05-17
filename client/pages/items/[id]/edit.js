import {
  Box,
  Button,
  Center,
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
  Spinner,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";

import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";
import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { schema } from "../../../schema/item";
import { useEditItem } from "../../../hooks/items/useEditItem";
import { useUpdateItem } from "../../../hooks/items/useUpdateItem";

const EditItem = () => {
  const router = useRouter();

  const { data, isLoading: editItemIsLoading } = useEditItem(router.query.id);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutateAsync: updateItem, isLoading: updateItemIsLoading } =
    useUpdateItem();

  const onSubmit = async input => {
    const { id } = await updateItem({ id: parseInt(router.query.id), input });
    if (id) router.push(`/items/${id}`);
  };

  return (
    <>
      <Title title="Edit Barang" />
      <Header>
        <HeaderBackButton href={`/items/${router.query.id}`} />
        <HeaderTitle>Edit Barang</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        {editItemIsLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="name" d="flex" isInvalid={errors.name}>
              <FormLabel mt="2" mb="0" mr="0" w={1 / 8}>
                Nama
              </FormLabel>
              <Box w={7 / 8}>
                <Input
                  variant="filled"
                  defaultValue={data.name}
                  {...register("name")}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl id="price" isInvalid={errors.price} d="flex" mt="4">
              <FormLabel mt="2" mb="0" mr="0" w={1 / 8}>
                Harga
              </FormLabel>
              <Box w={7 / 8}>
                <Controller
                  defaultValue={data.price}
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
              <Button
                type="submit"
                mt="6"
                isLoading={isSubmitting || updateItemIsLoading}
              >
                Perbarui
              </Button>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

EditItem.getLayout = getLayout;

export default EditItem;
