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
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { VscAdd, VscChromeClose } from "react-icons/vsc";

import Combobox from "./Combobox";
import NumberInput from "./NumberInput";
import { schema } from "../schema/saleDetails";

const NumberInputProps = {
  variant: "filled",
};

const defaultValue = {
  itemId: "",
  amount: undefined,
};

const SaleForm = ({ onSubmit, defaultValues, isLoading }) => {
  const [total, setTotal] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    register,
    setValue,
  } = useForm({
    defaultValues: {
      saleDetails: defaultValues.map(({ name, ...rest }) => ({
        ...rest,
      })),
    },
    resolver: yupResolver(schema),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "saleDetails",
  });

  const watchAllFields = watch("saleDetails");

  useEffect(() => {
    let total = 0;

    watchAllFields.map((field, index) => {
      if (field.itemId && field.amount && field.price) {
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
    const saleDetail = defaultValues.filter(
      defaultValue => defaultValue.itemId === itemId
    );

    if (!saleDetail.length) return null;

    return {
      node: {
        id: saleDetail[0].itemId,
        name: saleDetail[0].name,
        price: saleDetail[0].price,
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
            <Box w={7 / 12}>
              <Combobox
                control={control}
                name={`saleDetails.${index}.itemId`}
                setValue={setValue}
                initialSelectedItem={initialSelectedItem(field.itemId)}
              />
            </Box>
            <FormControl
              id={`saleDetails.${index}.amount`}
              isInvalid={errors.saleDetails?.[index]?.amount}
              w={2 / 12}
            >
              <FormLabel>Jumlah</FormLabel>
              <NumberInput
                control={control}
                name={`saleDetails.${index}.amount`}
                defaultValue={field.amount}
                inputProps={NumberInputProps}
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

export default SaleForm;
