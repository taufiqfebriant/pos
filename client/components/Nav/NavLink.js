import { Icon, Link, ListItem, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ icon, children, href, activeProps }) => {
  const router = useRouter();

  const parentRoute = router.pathname.split("/")[1];
  const parentHref = href.split("/")[1];

  return (
    <ListItem>
      <NextLink href={href} passHref>
        <Link
          _hover={{
            textDecoration: "none",
            bg: "gray.200",
            borderRadius: "base",
          }}
          pl="4"
          pr="12"
          py="3"
          d="flex"
          alignItems="center"
          {...((router.pathname === href || parentRoute === parentHref) &&
            activeProps)}
        >
          <Icon as={icon} boxSize="6" />
          <Text as="span" mx="4" fontSize="lg" fontWeight="semibold">
            {children}
          </Text>
        </Link>
      </NextLink>
    </ListItem>
  );
};

export default NavLink;
