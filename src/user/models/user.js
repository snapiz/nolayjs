export default {
  fields: {
    username: {
      type: "string"
    }
  },
  options: {},
  associations: [{target: "todo", type: "hasMany", options: {as: "lolo"}}],
  graphql: {}
}