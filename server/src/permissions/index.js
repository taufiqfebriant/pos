import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { shield } from "graphql-shield";
import path from "path";

const resolversArray = loadFilesSync(path.join(__dirname, "./*/*.js"));

const ruleTree = mergeResolvers(resolversArray);

export const permissions = shield(ruleTree, {
  allowExternalErrors: true,
});
