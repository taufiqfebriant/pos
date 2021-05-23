import { Icon, Link, ListItem, Text, useMediaQuery } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { mediaQueries } from "../utils/mediaQueries";

const NavLink = ({ icon, children, href, activeProps }) => {
  const router = useRouter();

  const [isLg] = useMediaQuery(mediaQueries.lg);

  const parentRoute = router.pathname.split("/")[1];
  const parentHref = href.split("/")[1];

  return (
    <ListItem>
      <NextLink href={href} passHref>
        <Link
          px="4"
          py="3"
          d="flex"
          alignItems="center"
          _hover={{
            textDecoration: "none",
            bg: "gray.100",
            borderRadius: "base",
            color: "green.500",
          }}
          {...((router.pathname === href || parentRoute === parentHref) &&
            activeProps)}
        >
          <Icon as={icon} boxSize="7" />
          {isLg && (
            <Text as="span" ml="4" fontSize="lg" fontWeight="semibold">
              {children}
            </Text>
          )}
        </Link>
      </NextLink>
    </ListItem>
  );
};

export default NavLink;
