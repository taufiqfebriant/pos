import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { print } from "graphql";

const typesArray = loadFilesSync(__dirname, {
  extensions: ["js"],
  ignoreIndex: true,
});

export const schema = print(mergeTypeDefs(typesArray));
