import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Title from "../components/Title";
import { useLogin } from "../hooks/auth/useLogin";
import { schema } from "../schema/login";
import { useViewer } from "../hooks/auth/useViewer";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { data, isLoading: viewerIsLoading, isFetching } = useViewer();
  const router = useRouter();

  useEffect(() => {
    if (viewerIsLoading || isFetching || data === undefined) return;

    if (data) return router.push("/dashboard");
    setLoading(false);
  }, [data, isFetching, viewerIsLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutateAsync, isLoading: loginIsLoading } = useLogin();

  const onSubmit = async input => {
    try {
      const success = await mutateAsync({ input });
      if (success) router.push("/dashboard");
    } catch (err) {
      const {
        response: { errors },
      } = JSON.parse(JSON.stringify(err));

      setError(errors[0].message);
    }
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <>
      <Title />
      <Flex align="center" justify="center" h="100vh" as="main">
        <Box>
          <Heading size="4xl">{process.env.NEXT_PUBLIC_APP_NAME}</Heading>
          <Box
            maxW="360px"
            mx="auto"
            as="form"
            mt="10"
            onSubmit={handleSubmit(onSubmit)}
          >
            {error && (
              <Alert status="error" mb="4">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl id="username" isInvalid={errors.username}>
              <Input
                placeholder="Nama pengguna"
                {...register("username")}
                variant="filled"
              />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isInvalid={errors.password} mt="4">
              <Input
                type="password"
                placeholder="Kata sandi"
                {...register("password")}
                variant="filled"
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              mt="4"
              isFullWidth={true}
              isLoading={isSubmitting || loginIsLoading}
            >
              Masuk
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Login;
