import { Flex } from "@chakra-ui/react";

const Header = ({ children, ...rest }) => {
  return (
    <Flex
      borderBottomWidth="thin"
      px="4"
      py="2"
      h="14"
      align="center"
      position="sticky"
      top="0"
      bg="white"
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default Header;
