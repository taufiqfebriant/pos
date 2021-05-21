import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { VscAdd, VscChromeClose } from "react-icons/vsc";
import { useQueryClient } from "react-query";
import { getEditSaleKey } from "../hooks/sales/useEditSale";

import { useUpdateSale } from "../hooks/sales/useUpdateSale";
import { schema } from "../schema/saleDetails";
import Combobox from "./Combobox";

const defaultValue = {
  itemId: "",
  amount: 0,
};

const EditSaleForm = ({ data }) => {
  const router = useRouter();
  const [total, setTotal] = useState(data.total);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    register,
  } = useForm({
    defaultValues: {
      saleDetails: data.saleDetails.map(saleDetail => ({
        itemId: saleDetail.item.id,
        amount: saleDetail.amount,
        price: saleDetail.unitPrice,
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
    const input = saleDetails.map(({ price, subTotal, ...rest }) => rest);

    const { id } = await mutateAsync({
      id: parseInt(router.query.id),
      input,
    });
    if (id) {
      await queryClient.invalidateQueries(getEditSaleKey(id));
      router.push(`/sales/${id}`);
    }
  };

  const watchAllFields = watch(`saleDetails`);

  useEffect(() => {
    let total = 0;

    watchAllFields.map((field, index) => {
      if (field.itemId && field.amount) {
        const subTotal = field.price * field.amount;

        if (field.subTotal !== subTotal) {
          setValue(`saleDetails.${index}.subTotal`, subTotal);
        }
        total += subTotal;
      }
    });

    setTotal(total);
  }, [watchAllFields, setValue]);

  const initialSelectedItem = itemId => {
    const saleDetail = data.saleDetails.filter(
      saleDetail => saleDetail.item.id === itemId
    );

    if (!saleDetail.length) return null;

    return {
      node: {
        id: saleDetail[0].item.id,
        name: saleDetail[0].item.name,
        price: saleDetail[0].unitPrice,
      },
    };
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => {
        register(`saleDetails.${index}.price`);
        register(`saleDetails.${index}.subTotal`);

        return (
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
                  setValue={setValue}
                  initialSelectedItem={initialSelectedItem(field.itemId)}
                />
              )}
            />
            <FormControl
              id={`saleDetails.${index}.amount`}
              isInvalid={errors.saleDetails?.[index]?.amount}
              w={2 / 12}
            >
              <FormLabel>Jumlah</FormLabel>
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
                {errors.saleDetails?.[index]?.amount?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl w={3 / 12}>
              <FormLabel>Subtotal</FormLabel>
              <HStack>
                <Input
                  variant="filled"
                  isReadOnly
                  value={new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(watch(`saleDetails.${index}.subTotal`) || 0)}
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
            </FormControl>
          </HStack>
        );
      })}
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
  );
};

export default EditSaleForm;
