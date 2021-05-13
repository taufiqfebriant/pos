import { LinkBox, LinkOverlay, Td } from "@chakra-ui/react";
import Link from "next/link";

const TdLink = ({ href, children }) => {
  return (
    <Td p="0">
      <LinkBox py="4" px="6">
        <Link href={href} passHref>
          <LinkOverlay>{children}</LinkOverlay>
        </Link>
      </LinkBox>
    </Td>
  );
};

export default TdLink;
