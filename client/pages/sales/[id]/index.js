import {
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import DeleteAlert from "../../../components/DeleteAlert";
import DetailOptions from "../../../components/DetailOptions";
import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";
import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { useDeleteSale } from "../../../hooks/sales/useDeleteSale";
import { useSale } from "../../../hooks/sales/useSale";

const Sale = () => {
  const router = useRouter();
  const { data, isLoading: saleIsLoading } = useSale(router.query.id);
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isLoading: deleteSaleIsLoading } = useDeleteSale();

  const deleteSale = async () => {
    const success = await mutateAsync({ id: Number(router.query.id) });
    if (success) router.push("/sales");
  };

  return (
    <>
      <Title title={`Penjualan #${data?.id}`} />
      <DeleteAlert
        title="Hapus Penjualan"
        isLoading={deleteSaleIsLoading}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteAction={deleteSale}
      />
      <Header>
        <HeaderBackButton href="/sales" />
        <HeaderTitle>Detail Penjualan</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        {saleIsLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Flex align="center" justify="space-between">
              <Heading size="lg">Penjualan #{data.id}</Heading>
              <DetailOptions
                editHref={`/sales/${data.id}/edit`}
                onDeleteClick={() => setIsOpen(true)}
              />
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
            <Box borderWidth="thin" mt="4">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Nama Barang</Th>
                    <Th isNumeric>Jumlah</Th>
                    <Th isNumeric>Harga Satuan</Th>
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.saleDetails.map(saleDetail => (
                    <Tr key={saleDetail.id}>
                      <Td>{saleDetail.item.name}</Td>
                      <Td isNumeric>{saleDetail.amount}</Td>
                      <Td isNumeric>
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(saleDetail.unitPrice)}
                      </Td>
                      <Td isNumeric>
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(saleDetail.total)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th colSpan="3">Total</Th>
                    <Th isNumeric>
                      {new Intl.NumberFormat("id", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(data.total)}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

Sale.getLayout = getLayout;

export default Sale;
