import bcrypt from "bcryptjs";

export default {
  fields: {
    username: {
      type: "string"
    },
    email: {
      type: "string",
      allowNull: false,
      validate: { isEmail: true }
    },
    password: {
      type: "string"
    },
    roles: "json"
  },
  options: {
    indexes: [{
      fields: ['email']
    }],
    graphql: {
      update: {
        exclude: ["roles"]
      }
    },
    hooks: {
      beforeCreate: (user, options) => {
        return user.hashPassword();
      },
      beforeUpdate: (user, options) => {
        
      }
    }
  },
  instanceMethods: {
    hashPassword: function () {
      const user = this;

      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            return reject(err);
          }
          bcrypt.hash(user.password, salt, (error, encrypted) => {
            if (err) {
              reject(err);
            } else {
              user.set("password", encrypted);
              resolve(user);
            }
          });
        });
      })
    },
    verifyPassword: function (password) {
      const user = this;

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, function (err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      })
    }
  },
  associations: []
}