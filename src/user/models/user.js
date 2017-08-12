export default {
  fields: {
    username: {
      type: "string"
    },
    roles: "json"
  },
  options: {
    graphql: {
      update: {
        exclude: ["roles"]
      }
    }
  },
  associations: []
}