import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { schema } from "../schema/item";
import NumberInput from "./NumberInput";

const NumberInputProps = {
  variant: "filled",
};

const ItemForm = ({ defaultValues, isLoading, onSubmit, buttonText }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  return (
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
            inputProps={NumberInputProps}
          />
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </Box>
      </FormControl>
      <Flex justify="flex-end">
        <Button type="submit" mt="6" isLoading={isSubmitting || isLoading}>
          {buttonText}
        </Button>
      </Flex>
    </Box>
  );
};

export default ItemForm;
