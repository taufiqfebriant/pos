import {
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VscEdit, VscEllipsis, VscTrash } from "react-icons/vsc";

const DetailOptions = ({ editHref, onDeleteClick }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<VscEllipsis />}
        variant="ghost"
        color="gray.600"
        fontSize="2xl"
        _hover={{ bg: "gray.100", color: "green.500" }}
        _active={{ bg: "gray.100", color: "green.500" }}
      />
      <MenuList>
        <NextLink href={editHref} passHref>
          <Link _hover={{ textDecoration: "none" }}>
            <MenuItem icon={<VscEdit />}>Edit</MenuItem>
          </Link>
        </NextLink>
        <MenuItem icon={<VscTrash />} color="red.500" onClick={onDeleteClick}>
          Hapus
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DetailOptions;
