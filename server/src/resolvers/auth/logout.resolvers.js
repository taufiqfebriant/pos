export default {
  Mutation: {
    logout: async (_, {}, { request }) => {
      await request.session.destroy();
      return true;
    },
  },
};
