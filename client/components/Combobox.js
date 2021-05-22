import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useCombobox } from "downshift";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import { useItemSearch } from "../hooks/items/useItemSearch";

const Combobox = ({ control, name, initialSelectedItem, setValue }) => {
  const [items, setItems] = useState([]);
  const [variables, setVariables] = useState({ first: 5 });

  const {
    field: { onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
    inputValue,
  } = useCombobox({
    initialSelectedItem,
    id: name,
    items,
    itemToString: item => item.node.name || "",
    onSelectedItemChange: ({ selectedItem }) => {
      onChange(selectedItem.node.id);

      const fieldName = name.split(".");
      setValue(
        `${fieldName[0]}.${fieldName[1]}.price`,
        selectedItem.node.price
      );
    },
  });

  useEffect(() => {
    if (inputValue) {
      setVariables(prev => ({
        ...prev,
        where: { name: { startsWith: inputValue } },
      }));
    }
  }, [inputValue]);

  const { data, isLoading } = useItemSearch(variables, {
    enabled: Boolean(inputValue),
  });

  useEffect(() => {
    if (!isLoading && data?.edges) {
      setItems(data.edges);
    }
  }, [data?.edges, isLoading]);

  return (
    <>
      <FormControl isInvalid={error}>
        <FormLabel {...getLabelProps()}>Barang</FormLabel>
        <Box {...getComboboxProps()}>
          <Input variant="filled" {...getInputProps()} />
        </Box>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
      <List {...getMenuProps()} bg="gray.100">
        {inputValue &&
          items.length &&
          isOpen &&
          items.map((edge, index) => (
            <ListItem
              key={edge.node.id}
              {...getItemProps({ edge, index })}
              py="2"
              px="4"
              cursor="pointer"
              bg={highlightedIndex === index && "gray.200"}
            >
              {edge.node.name}
            </ListItem>
          ))}
      </List>
    </>
  );
};

export default Combobox;
