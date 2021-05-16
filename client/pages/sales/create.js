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
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import { useItems } from "../../hooks/items/useItems";
import { schema } from "../../schema/saleDetails";
import { useCreateSale } from "../../hooks/sales/useCreateSale";
import Header from "../../components/Header";
import HeaderBackButton from "../../components/HeaderBackButton";
import HeaderTitle from "../../components/HeaderTitle";
import { VscAdd, VscChromeClose } from "react-icons/vsc";

const defaultValue = {
  itemId: "",
  amount: undefined,
};

const CreateSale = () => {
  const router = useRouter();
  const [total, setTotal] = useState(0);

  const { data } = useItems();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      saleDetails: [defaultValue],
    },
    resolver: yupResolver(schema),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "saleDetails",
  });

  const { mutateAsync, isLoading } = useCreateSale();

  const onSubmit = async ({ saleDetails }) => {
    const { id } = await mutateAsync({ input: saleDetails });
    if (id) router.push(`/sales/${id}`);
  };

  const watchAllFields = watch(`saleDetails`);

  useEffect(() => {
    let total = 0;

    watchAllFields.map(field => {
      if (field.itemId && field.amount) {
        const price = data.find(item => item.id === field.itemId).price;
        total += price * field.amount;
      }
    });

    setTotal(total);
  }, [watchAllFields, data]);

  return (
    <>
      <Title title="Tambah Penjualan" />
      <Header>
        <HeaderBackButton href="/sales" />
        <HeaderTitle>Tambah Penjualan</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <HStack key={field.id} mt={index > 0 && 4} align="unset">
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
                  {/* {data.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))} */}
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
          <Flex align="center" justify="space-between" mt="6">
            <Text fontSize="lg" fontWeight="medium">
              Total:{" "}
              {new Intl.NumberFormat("id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(total)}
            </Text>
            <HStack>
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
          </Flex>
        </Box>
      </Box>
    </>
  );
};

CreateSale.getLayout = getLayout;

export default CreateSale;
