import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { VscAdd, VscChromeClose } from "react-icons/vsc";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

import Title from "../../../components/Title";
import { getLayout } from "../../../components/Layout";
import { getItems, getItemsKey, useItems } from "../../../hooks/items/useItems";
import { schema } from "../../../schema/saleDetails";
import {
  useEditSale,
  getEditSale,
  getEditSaleKey,
} from "../../../hooks/sales/useEditSale";
import {
  getLatestSales,
  getLatestSalesKey,
} from "../../../hooks/sales/useLatestSales";
import { useUpdateSale } from "../../../hooks/sales/useUpdateSale";
import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";

const defaultValue = {
  itemId: "",
  amount: undefined,
};

const EditSale = () => {
  const router = useRouter();
  const { data: sale } = useEditSale(router.query.id);

  const { data: items } = useItems();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      saleDetails: sale.saleDetails.map(saleDetail => ({
        itemId: saleDetail.item.id,
        amount: saleDetail.amount,
      })),
    },
    resolver: yupResolver(schema),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "saleDetails",
  });

  const { mutateAsync, isLoading } = useUpdateSale();

  const onSubmit = async ({ saleDetails }) => {
    const { id } = await mutateAsync({
      id: Number(router.query.id),
      input: saleDetails,
    });
    if (id) router.push(`/sales/${id}`);
  };

  return (
    <>
      <Title title="Edit Penjualan" />
      <Header>
        <HeaderBackButton href={`/sales/${router.query.id}`} />
        <HeaderTitle>Edit Penjualan</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <HStack key={field.id} mt={index > 0 ? 4 : undefined} align="unset">
              <FormControl
                id={`saleDetails.${index}.itemId`}
                isInvalid={errors.saleDetails?.[index]?.itemId}
                w={8 / 12}
              >
                <FormLabel>Barang</FormLabel>
                <Select
                  {...register(`saleDetails.${index}.itemId`)}
                  defaultValue={field.itemId}
                  variant="filled"
                >
                  <option value="" disabled></option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.saleDetails?.[index]?.itemId?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id={`saleDetails.${index}.amount`}
                isInvalid={errors.saleDetails?.[index]?.amount}
                w={4 / 12}
              >
                <FormLabel>Jumlah</FormLabel>
                <HStack>
                  <Controller
                    defaultValue={field.amount}
                    control={control}
                    name={`saleDetails.${index}.amount`}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { invalid },
                    }) => (
                      <NumberInput
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        variant="filled"
                        isInvalid={invalid}
                        w={fields.length > 1 && 3 / 4}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  {fields.length > 1 && (
                    <IconButton
                      colorScheme="gray"
                      color="red.500"
                      aria-label="Delete field"
                      icon={<VscChromeClose />}
                      _active={{ bg: "gray.100" }}
                      w={1 / 4}
                      onClick={() => remove(index)}
                    />
                  )}
                </HStack>
                <FormErrorMessage>
                  {errors.saleDetails?.[index]?.amount?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
          ))}
          <HStack justify="flex-end" mt="6">
            <IconButton
              colorScheme="gray"
              aria-label="Add field"
              icon={<VscAdd />}
              _active={{ bg: "gray.100" }}
              w={1 / 12}
              onClick={() => append(defaultValue)}
            />
            <Button type="submit" isLoading={isSubmitting || isLoading}>
              Simpan
            </Button>
          </HStack>
        </Box>
      </Box>
    </>
  );
};

export const getStaticPaths = async () => {
  const queryClient = new QueryClient();

  const latestSales = await queryClient.fetchQuery(
    [getLatestSalesKey, { take: 10, orderBy: { id: "desc" } }],
    getLatestSales
  );

  const paths = latestSales.map(sale => ({
    params: { id: sale.id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([getEditSaleKey, id], getEditSale);
  await queryClient.prefetchQuery(getItemsKey, getItems);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

EditSale.getLayout = getLayout;

export default EditSale;
