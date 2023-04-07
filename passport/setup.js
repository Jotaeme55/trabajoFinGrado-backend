const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Local Strategy
passport.use(
    new LocalStrategy({ emailField: "email" }, (email, password, done) => {
        // Match User
        User.findOne({ "email": email })
            .then(user => {
                // Create new User
                if (user) {
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { field: "password", message: "Contraseña incorrecta para el usuario: " + email });
                        }
                    });
                } else {
                    return done(null, false, { field: "email", message: "No se encontró al usuario: " + email });
                }
            })
            .catch(err => {
                return done(null, false, { message: err });
            });
    })
);


module.exports = passport;