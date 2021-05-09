import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { useDeleteSale } from "../../../hooks/sales/useDeleteSale";
import { getLatestSales } from "../../../hooks/sales/useLatestSales";
import { getSale, useSale } from "../../../hooks/sales/useSale";

const Sale = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const router = useRouter();
  const { data } = useSale(router.query.id);

  const { mutateAsync, isLoading } = useDeleteSale();

  const deleteSale = async () => {
    const success = await mutateAsync({ id: Number(router.query.id) });
    if (success) router.push("/sales");
  };

  return (
    <>
      <Title title={`Penjualan #${data.id}`} />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Penjualan
            </AlertDialogHeader>

            <AlertDialogBody>
              Anda yakin ingin menghapus data ini?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme="gray">
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteSale}
                ml={3}
                isLoading={isLoading}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex align="center" justify="space-between">
        <Heading size="lg">Penjualan #{data.id}</Heading>
        <Stack direction="row" spacing="4">
          <NextLink href={`/sales/${data.id}/edit`} passHref>
            <Link _hover={{ textDecoration: "none" }}>
              <Button
                leftIcon={<FaEdit />}
                colorScheme="gray"
                variant="outline"
              >
                Edit
              </Button>
            </Link>
          </NextLink>
          <Button
            leftIcon={<FaTrash />}
            colorScheme="gray"
            variant="outline"
            color="red"
            onClick={() => setIsOpen(true)}
          >
            Hapus
          </Button>
        </Stack>
      </Flex>
      <Box as="dl" d="flex" flexWrap="wrap" mt="4">
        <Box as="dd" w={1 / 5} fontWeight="medium">
          Dibuat pada
        </Box>
        <Box as="dt" w={4 / 5} color="gray.600">
          {dayjs(Number(data.createdAt)).format("DD MMMM YYYY HH:mm:ss")}
        </Box>
        <Box as="dd" w={1 / 5} fontWeight="medium" mt="1">
          Diperbarui pada
        </Box>
        <Box as="dt" w={4 / 5} color="gray.600" mt="1">
          {dayjs(Number(data.updatedAt)).format("DD MMMM YYYY HH:mm:ss")}
        </Box>
      </Box>
      <Box
        border="1px"
        borderColor="gray.100"
        borderRadius="base"
        mt="4"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead>
            <Tr bg="gray.50">
              <Th>No. Barang</Th>
              <Th>Nama Barang</Th>
              <Th>Jumlah</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.saleDetails.map(saleDetail => (
              <Tr key={saleDetail.id}>
                <Td>{saleDetail.id}</Td>
                <Td>{saleDetail.item.name}</Td>
                <Td>{saleDetail.amount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export const getStaticPaths = async () => {
  const queryClient = new QueryClient();

  const latestSales = await queryClient.fetchQuery(
    ["latestSales", 10, { id: "desc" }],
    getLatestSales
  );

  const paths = latestSales.map(sale => ({
    params: { id: sale.id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["sales", id], getSale);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

Sale.getLayout = getLayout;

export default Sale;
