import "focus-visible/dist/focus-visible";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "dayjs/locale/id";
import "nprogress/nprogress.css";
import "../styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import Router from "next/router";
import NProgress from "nprogress";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import theme from "../theme";

dayjs.locale("id");

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout;

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} portalZIndex={1}>
        {getLayout ? (
          getLayout(<Component {...pageProps} />)
        ) : (
          <Component {...pageProps} />
        )}
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
