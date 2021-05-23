import { Box, Container, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Nav from "./Nav";
import { useViewer } from "../hooks/auth/useViewer";

const Layout = ({ children }) => {
  const ref = useRef();

  const [loading, setLoading] = useState(true);

  const { data, isLoading: viewerIsLoading, isFetching } = useViewer();

  const router = useRouter();

  useEffect(() => {
    if (viewerIsLoading || isFetching || data === undefined) return;

    if (!data) return router.push("/");
    setLoading(false);
  }, [data, isFetching, viewerIsLoading, router]);

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.lg" d="flex" px="0">
      <Nav />
      <Box borderWidth="0 thin" w="full" ref={ref}>
        {children}
      </Box>
    </Container>
  );
};

export const getLayout = page => <Layout>{page}</Layout>;

export default Layout;
