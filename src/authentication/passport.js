import passport from 'passport';
import LocalStrategy from "passport-local";

passport.use(new LocalStrategy(
  function (username, password, done) {
    DB.User.findOne({ where: { username: username } }).then((user) => {
      if(!user) {
        return false;
      }
      return user.verifyPassword(password).then((isValid) => {
        return isValid ? user : false;
      });
    }).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err);
    });
  }
));

export default passport;