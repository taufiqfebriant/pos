import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  UnorderedList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  VscDashboard,
  VscPackage,
  VscGraph,
  VscEllipsis,
  VscSignOut,
  VscPerson,
} from "react-icons/vsc";

import NavLink from "./NavLink";
import { useLogout } from "../hooks/auth/useLogout";
import { useViewer } from "../hooks/auth/useViewer";

const activeProps = {
  color: "green.500",
};

const Nav = () => {
  const router = useRouter();

  const { data } = useViewer();

  const { mutateAsync, isLoading } = useLogout();

  const logout = async () => {
    const success = await mutateAsync();
    if (success) router.push("/");
  };

  return (
    <Box as="aside" pt="2.5" pb="6" px="3" position="sticky" top="0" h="100vh">
      <Flex direction="column" justify="space-between" h="full">
        <Box>
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
          <Box as="nav">
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
              <NavLink
                icon={VscPackage}
                href="/items"
                activeProps={activeProps}
              >
                Barang
              </NavLink>
            </UnorderedList>
          </Box>
        </Box>
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="gray"
              size="lg"
              variant="ghost"
              leftIcon={<Icon as={VscPerson} boxSize="7" />}
              rightIcon={<VscEllipsis />}
              textAlign="left"
              fontSize="md"
              pl="4"
            >
              {data.name}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<VscSignOut />} onClick={logout}>
                Keluar
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Box>
  );
};

export default Nav;
