import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
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
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

import Title from "../../../components/Title";
import { getLayout } from "../../../components/Layout";
import { getItems, useItems } from "../../../hooks/items/useItems";
import { saleDetailsSchema } from "../../../schema/saleDetails";
import { useEditSale, getEditSale } from "../../../hooks/sales/useEditSale";
import { getLatestSales } from "../../../hooks/sales/useLatestSales";
import { useUpdateSale } from "../../../hooks/sales/useUpdateSale";

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
    resolver: yupResolver(saleDetailsSchema),
  });

  const { fields } = useFieldArray({
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
      <Heading size="lg">Edit Penjualan</Heading>
      <Box as="form" mt="6" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <FormControl
              id={`saleDetails.${index}.itemId`}
              d="flex"
              isInvalid={errors.saleDetails?.[index].itemId}
            >
              <FormLabel mt="2" mb="0" mr="0" w={1 / 6}>
                Barang
              </FormLabel>
              <Box w={5 / 6}>
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
                  {errors.saleDetails?.[index].itemId?.message}
                </FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl
              id={`saleDetails.${index}.amount`}
              isInvalid={errors.saleDetails?.[index].amount}
              d="flex"
              mt="4"
            >
              <FormLabel mt="2" mb="0" mr="0" w={1 / 6}>
                Jumlah
              </FormLabel>
              <Box w={5 / 6}>
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
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>
                  {errors.saleDetails?.[index].amount?.message}
                </FormErrorMessage>
              </Box>
            </FormControl>
          </Fragment>
        ))}
        <Flex justify="flex-end">
          <Button type="submit" mt="6" isLoading={isSubmitting || isLoading}>
            Simpan
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export const getStaticPaths = async () => {
  const queryClient = new QueryClient();

  const latestSales = await queryClient.fetchQuery(
    ["latestSales", 10, { id: "desc" }],
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

  await queryClient.prefetchQuery(["sales", "edit", id], getEditSale);
  await queryClient.prefetchQuery("items", getItems);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

EditSale.getLayout = getLayout;

export default EditSale;
