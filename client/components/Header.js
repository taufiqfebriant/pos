import { Box } from "@chakra-ui/react";

const Header = ({ children, ...rest }) => {
  return (
    <Box borderBottomWidth="thin" px="4" py="3" {...rest}>
      {children}
    </Box>
  );
};

export default Header;
