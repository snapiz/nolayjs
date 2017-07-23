import nolayjs from "../../src";

const app = nolayjs({
  middlewares: [],
  graphql: {
    url: "/graphql",
    browser: false
  },
  sequelize: {
    database: {
      logging: false,
      storage: "./test/data/db.sqlite"
    },
    sync: {
      force: true
    },
    models: {
      user: {
        fields: {
          firstName: {
            type: "string",
            field: "first_name"
          },
          lastName: {
            type: "string",
            field: "last_name"
          },
          email: "string",
          password: "string",
          isAdmin: {
            type: "boolean",
            field: "is_admin",
            defaultValue: false
          }
        },
        options: {
          underscored: true,
          tableName: "users"
        },
        associations: [{
          type: "hasMany",
          target: "todo",
          options: { as: "todos", foreignKey: "owner_id" }
        }]
      },
      todo: {
        fields: {
          text: "string",
          completed: "boolean"
        },
        options: {
          underscored: true,
          tableName: "todos"
        },
        associations: [{
          type: "belongsTo",
          target: "user",
          options: { as: "owner" }
        }]
      }
    }
  },
  policies: {
    todopolicy1: function (args, context, info) {
      if (context.todopolicy1) {
        throw new Error("acl todo policy 1");
      }
    }
  },
  acl: {
    user: {
      "create": function (args, context, info) {
        if (context.usercreate) {
          throw new Error("acl user create");
        }
      },
      "update": function (args, context, info) {
        if (context.userupdate) {
          throw new Error("acl user update");
        }
      },
      "delete": [function (args, context, info) {
        if (context.userdelete1) {
          throw new Error("acl user delete 1");
        }
      }, function (args, context, info) {
        if (context.userdelete2) {
          throw new Error("acl user delete 2");
        }
      }],
      "find": function (args, context, info) {
        if (context.userfind1) {
          throw new Error("acl user find 1");
        }
      }
    },
    todo: {
      "*": function (args, context, info) {
        if (context.todoAll) {
          throw new Error("acl todo all 1");
        }
      },
      find: [function (args, context, info) {
        if (context.todofind1) {
          throw new Error("acl todo find 1");
        }
      }, function (args, context, info) {
        if (context.todofind2) {
          throw new Error("acl todo find 2");
        }
      }],
      create: "todopolicy1"
    }
  }
});
/* const { _middlewares: { load } } = app.get('options');
load.push(function () {
  
}); */
export default app;