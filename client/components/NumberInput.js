import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useController } from "react-hook-form";

const NumberInput = ({ control, name, inputProps }) => {
  const {
    field: { ref, ...fieldProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
  });

  return (
    <ChakraNumberInput
      {...fieldProps}
      ref={ref}
      isInvalid={invalid}
      {...inputProps}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </ChakraNumberInput>
  );
};

export default NumberInput;
