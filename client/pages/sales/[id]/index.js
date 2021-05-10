import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import DeleteAlert from "../../../components/DeleteAlert";
import DetailOptions from "../../../components/DetailOptions";
import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";

import { getLayout } from "../../../components/Layout";
import Title from "../../../components/Title";
import { useDeleteSale } from "../../../hooks/sales/useDeleteSale";
import {
  getLatestSales,
  getLatestSalesKey,
} from "../../../hooks/sales/useLatestSales";
import { getSale, getSaleKey, useSale } from "../../../hooks/sales/useSale";

const Sale = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      <DeleteAlert
        title="Hapus Penjualan"
        isLoading={isLoading}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteAction={deleteSale}
      />
      <Header>
        <HeaderBackButton href="/sales" />
        <HeaderTitle>Detail Penjualan</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
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
                <Th>No. Barang</Th>
                <Th>Nama Barang</Th>
                <Th isNumeric>Jumlah</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.saleDetails.map(saleDetail => (
                <Tr key={saleDetail.id}>
                  <Td>{saleDetail.id}</Td>
                  <Td>{saleDetail.item.name}</Td>
                  <Td isNumeric>{saleDetail.amount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </>
  );
};

export const getStaticPaths = async () => {
  const queryClient = new QueryClient();

  const latestSales = await queryClient.fetchQuery(
    [getLatestSalesKey, { take: 10, orderBy: { id: "desc" } }],
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

  await queryClient.prefetchQuery([getSaleKey, id], getSale);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

Sale.getLayout = getLayout;

export default Sale;
