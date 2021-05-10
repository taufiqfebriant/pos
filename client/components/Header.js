import { Flex } from "@chakra-ui/react";

const Header = ({ children, ...rest }) => {
  return (
    <Flex
      as="header"
      borderBottomWidth="thin"
      px="4"
      py="2"
      h="14"
      align="center"
      position="sticky"
      top="0"
      bg="white"
      zIndex="1"
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default Header;
