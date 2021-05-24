import {
  Box,
  Container,
  Flex,
  Portal,
  Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Nav from "./Nav";
import ConditionalWrapper from "./ConditionalWrapper";
import { useViewer } from "../hooks/auth/useViewer";
import { mediaQueries } from "../utils/mediaQueries";

const Layout = ({ children }) => {
  const ref = useRef();

  const [loading, setLoading] = useState(true);

  const { data, isLoading: viewerIsLoading, isFetching } = useViewer();

  const router = useRouter();

  const [isSm] = useMediaQuery(mediaQueries.sm);

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
      <ConditionalWrapper
        condition={!isSm}
        wrapper={children => <Portal>{children}</Portal>}
      >
        <Nav />
      </ConditionalWrapper>
      <Box borderWidth="0 thin" w="full" ref={ref}>
        {children}
      </Box>
    </Container>
  );
};

export const getLayout = page => <Layout>{page}</Layout>;

export default Layout;
