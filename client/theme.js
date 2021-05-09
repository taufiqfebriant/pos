import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "base",
      },
      defaultProps: {
        colorScheme: "green",
      },
    },
    Input: {
      sizes: {
        md: {
          field: {
            borderRadius: "base",
          },
          addon: {
            borderRadius: "base",
          },
        },
      },
      variants: {
        filled: props => ({
          field: {
            _focus: {
              borderColor: mode("green.300", "green.300")(props),
            },
          },
        }),
      },
    },
    Select: {
      variants: {
        filled: props => ({
          field: {
            _focus: {
              borderColor: mode("green.300", "green.300")(props),
            },
          },
        }),
      },
    },
    NumberInput: {
      variants: {
        filled: props => ({
          field: {
            _focus: {
              borderColor: mode("green.300", "green.300")(props),
            },
          },
        }),
      },
    },
  },
});

export default theme;
