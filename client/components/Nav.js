import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  UnorderedList,
  useMediaQuery,
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
import { mediaQueries } from "../utils/mediaQueries";

const activeProps = {
  color: "green.500",
};

const Nav = () => {
  const router = useRouter();

  const [isSm] = useMediaQuery(mediaQueries.sm);
  const [isLg] = useMediaQuery(mediaQueries.lg);

  const { data } = useViewer();

  const { mutateAsync, isLoading } = useLogout();

  const logout = async () => {
    const success = await mutateAsync();
    if (success) router.push("/");
  };

  return (
    <Box
      as={isSm && "aside"}
      position={isSm ? "sticky" : "fixed"}
      top={isSm && "0"}
      bottom={!isSm && "0"}
      h={isSm && "100vh"}
      pt={isSm && "2"}
      pb={isSm && "6"}
      px={isSm && "4"}
      borderTopWidth={!isSm && "thin"}
      w={!isSm && "full"}
      bg="white"
    >
      <Flex direction="column" justify="space-between" h="full">
        <Box>
          {isSm && (
            <NextLink href="/dashboard" passHref>
              <Link d="inline-block" ml="2.5">
                <Image src="./logo.svg" boxSize="40px" />
              </Link>
            </NextLink>
          )}
          <Box as="nav">
            <UnorderedList
              listStyleType="none"
              ml="0"
              mt={isSm && "3"}
              d={!isSm && "flex"}
            >
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
          isSm && (
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="gray"
                variant="ghost"
                maxW="225px"
                px="4"
                py="2"
                size="lg"
              >
                <HStack spacing="4">
                  <Icon as={VscPerson} boxSize="7" />
                  {isLg && (
                    <>
                      <Text fontSize="sm" isTruncated>
                        {data.name}
                      </Text>
                      <Icon as={VscEllipsis} boxSize="4" />
                    </>
                  )}
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<VscSignOut />} onClick={logout}>
                  Keluar
                </MenuItem>
              </MenuList>
            </Menu>
          )
        )}
      </Flex>
    </Box>
  );
};

export default Nav;
