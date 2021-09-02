const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../database/connection');
const collection = require('../database/collection');
const objectId = require('mongodb').ObjectID;

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACKURL
    },
        async (accessToken, refreshToken, profile, done) => {
            const user = await db.get().collection(collection.APPLICANT).findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            } else {
                db.get().collection(collection.APPLICANT).insertOne({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                }).then((user) => {
                    return done(null, user.ops[0]);
                });
            }

        }
    ));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_CALLBACK,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        async (accessToken, refreshToken, profile, done) => {
            const user = await db.get().collection(collection.APPLICANT).findOne({ facebookId: profile.id });
            if (user) {
                return done(null, user);
            } else {
                db.get().collection(collection).insertOne({
                    facebookId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                }).then((user) => {
                    return done(null, user.ops[0]);
                });
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await db.get().collection(collection.APPLICANT).findOne({ _id: objectId(id) });
        done(null, user);
    });
}