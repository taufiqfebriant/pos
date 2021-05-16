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
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { VscAdd, VscChromeClose } from "react-icons/vsc";

import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import { schema } from "../../schema/saleDetails";
import { useCreateSale } from "../../hooks/sales/useCreateSale";
import Combobox from "../../components/Combobox";
import Header from "../../components/Header";
import HeaderBackButton from "../../components/HeaderBackButton";
import HeaderTitle from "../../components/HeaderTitle";

const defaultValue = {
  itemId: "",
  amount: undefined,
  price: 0,
};

const CreateSale = () => {
  const router = useRouter();
  const [total, setTotal] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
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
    const input = saleDetails.map(({ price, ...rest }) => rest);

    const { id } = await mutateAsync({ input });
    if (id) router.push(`/sales/${id}`);
  };

  const watchAllFields = watch(`saleDetails`);

  useEffect(() => {
    let total = 0;

    watchAllFields.map(field => {
      if (field.itemId && field.amount) {
        total += field.price * field.amount;
      }
    });

    setTotal(total);
  }, [watchAllFields]);

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
              <Controller
                defaultValue={field.itemId}
                control={control}
                name={`saleDetails.${index}.itemId`}
                render={({
                  field: { onChange, name },
                  fieldState: { invalid, error },
                }) => (
                  <Combobox
                    onChange={onChange}
                    name={name}
                    isInvalid={invalid}
                    error={error}
                    setPriceValue={setValue}
                    index={index}
                  />
                )}
              />
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
