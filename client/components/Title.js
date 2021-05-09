import Head from "next/head";

const Title = ({ title }) => {
  return (
    <Head>
      <title>
        {title && `${title} | `}
        {process.env.NEXT_PUBLIC_APP_NAME}
      </title>
    </Head>
  );
};

export default Title;
