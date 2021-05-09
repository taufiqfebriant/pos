import { Box, Link, UnorderedList } from "@chakra-ui/react";
import NextLink from "next/link";
import { VscDashboard, VscPackage, VscGraph } from "react-icons/vsc";

import NavLink from "./NavLink";

const activeProps = {
  color: "green.500",
};

const Nav = () => {
  return (
    <Box as="nav" pt="4" px="3">
      <NextLink href="/" passHref>
        <Link
          fontSize="2xl"
          pl="4"
          fontWeight="bold"
          _hover={{ textDecoration: "none" }}
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </NextLink>
      <UnorderedList listStyleType="none" ml="0" mt="3">
        <NavLink
          icon={VscDashboard}
          href="/dashboard"
          activeProps={activeProps}
        >
          Dasbor
        </NavLink>
        <NavLink icon={VscGraph} href="/sales" activeProps={activeProps}>
          Penjualan
        </NavLink>
        <NavLink icon={VscPackage} href="/items" activeProps={activeProps}>
          Barang
        </NavLink>
      </UnorderedList>
    </Box>
  );
};

export default Nav;
