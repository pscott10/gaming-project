//https://infisical.com/blog/guide-to-implementing-oauth2
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        console.log("Google profile:", profile);
        const db = require('../database/db');
        db.get("SELECT * FROM users WHERE googleId = ?", [profile.id], (err, user) => {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null,user);
            } else{
                //make user
                const email = (profile.emails && profile.emails[0].value) || null;
                const name = profile.displayName || '';

                const insertQuery = "INSERT INTO users (googleID, email, name) VALUES (?, ?, ?)";
                db.run(insertQuery, [profile.id, email, name], function(err) {
                    if(err) {
                        return done(err);
                    }
                    db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (err, newUser) => {
                        if(err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                });
            }
        });
    }
));

passport.serializeUser((user,done) => {
    done(null,user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});