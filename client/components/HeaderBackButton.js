import { IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { VscArrowLeft } from "react-icons/vsc";

const HeaderBackButton = ({ href }) => {
  return (
    <NextLink href={href} passHref>
      <Link mr="4">
        <IconButton
          variant="ghost"
          colorScheme="gray"
          color="gray.600"
          aria-label="Back to previous page"
          fontSize="2xl"
          icon={<VscArrowLeft />}
          _hover={{ bg: "gray.100", color: "green.500" }}
          _active={{ bg: "gray.100", color: "green.500" }}
        />
      </Link>
    </NextLink>
  );
};

export default HeaderBackButton;
