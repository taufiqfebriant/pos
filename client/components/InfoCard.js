import { Box, Heading, HStack, Icon, Text } from "@chakra-ui/react";

const InfoCard = ({ icon, title, description }) => {
  return (
    <HStack
      borderWidth="thin"
      flex="1"
      py="3"
      px="4"
      borderRadius="base"
      align="center"
      spacing="3"
    >
      <Icon as={icon} boxSize="8" />
      <Box>
        <Heading fontSize="2xl">{title}</Heading>
        <Text>{description}</Text>
      </Box>
    </HStack>
  );
};

export default InfoCard;
