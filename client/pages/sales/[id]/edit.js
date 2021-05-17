import { Box, Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Title from "../../../components/Title";
import { getLayout } from "../../../components/Layout";
import { useEditSale } from "../../../hooks/sales/useEditSale";
import Header from "../../../components/Header";
import HeaderBackButton from "../../../components/HeaderBackButton";
import HeaderTitle from "../../../components/HeaderTitle";
import EditSaleForm from "../../../components/EditSaleForm";

const EditSale = () => {
  const router = useRouter();

  const { data, isLoading } = useEditSale(router.query.id);

  return (
    <>
      <Title title="Edit Penjualan" />
      <Header>
        <HeaderBackButton href={`/sales/${router.query.id}`} />
        <HeaderTitle>Edit Penjualan</HeaderTitle>
      </Header>
      <Box as="main" px="4" py="3">
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <EditSaleForm data={data} />
        )}
      </Box>
    </>
  );
};

EditSale.getLayout = getLayout;

export default EditSale;
