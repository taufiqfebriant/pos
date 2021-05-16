export default {
  Node: {
    __resolveType: obj => {
      return obj.__typename;
    },
  },
};
