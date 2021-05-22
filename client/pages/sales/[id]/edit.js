import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Title from "../../../components/Title";
import { getLayout } from "../../../components/Layout";
import { getEditSaleKey, useEditSale } from "../../../hooks/sales/useEditSale";
import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";
import SaleForm from "../../../components/SaleForm";
import { useUpdateSale } from "../../../hooks/sales/useUpdateSale";
import { useQueryClient } from "react-query";

const EditSale = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading: editSaleIsLoading } = useEditSale(router.query.id);

  const { mutateAsync, isLoading: updateSaleIsLoading } = useUpdateSale();
  const onSubmit = async ({ saleDetails }) => {
    const input = saleDetails.map(({ price, subTotal, ...rest }) => rest);

    const { id } = await mutateAsync({
      id: parseInt(router.query.id),
      input,
    });
    if (id) {
      await queryClient.invalidateQueries(getEditSaleKey(id));
      router.push(`/sales/${id}`);
    }
  };

  return (
    <>
      <Title title="Edit Penjualan" />
      <Header>
        <HeaderBackButton href={`/sales/${router.query.id}`} />
        <HeaderTitle>Edit Penjualan</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        {editSaleIsLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : data ? (
          <SaleForm
            defaultValues={data.saleDetails.map(saleDetail => ({
              itemId: saleDetail.item.id,
              name: saleDetail.item.name,
              amount: saleDetail.amount,
              price: saleDetail.unitPrice,
              subTotal: saleDetail.unitPrice * saleDetail.amount,
            }))}
            isLoading={updateSaleIsLoading}
            onSubmit={onSubmit}
          />
        ) : (
          <Text align="center">Tidak ada data</Text>
        )}
      </Box>
    </>
  );
};

EditSale.getLayout = getLayout;

export default EditSale;
