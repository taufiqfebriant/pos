export default {
  Mutation: {
    logout: (_, {}, { request }) => {
      request.session.delete();
      return true;
    },
  },
};
