import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Title from "../../components/Title";
import { getLayout } from "../../components/Layout";
import { useCreateSale } from "../../hooks/sales/useCreateSale";
import Header from "../../components/Header";
import HeaderBackButton from "../../components/HeaderBackButton";
import HeaderTitle from "../../components/HeaderTitle";
import SaleForm from "../../components/SaleForm";

const CreateSale = () => {
  const router = useRouter();

  const { mutateAsync, isLoading } = useCreateSale();

  const onSubmit = async ({ saleDetails }) => {
    const input = saleDetails.map(({ price, subTotal, ...rest }) => rest);

    const { id } = await mutateAsync({ input });
    if (id) router.push(`/sales/${id}`);
  };

  return (
    <>
      <Title title="Tambah Penjualan" />
      <Header>
        <HeaderBackButton href="/sales" />
        <HeaderTitle>Tambah Penjualan</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        <SaleForm
          defaultValues={[
            {
              itemId: "",
              amount: undefined,
              price: undefined,
              subTotal: undefined,
            },
          ]}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </Box>
    </>
  );
};

CreateSale.getLayout = getLayout;

export default CreateSale;
