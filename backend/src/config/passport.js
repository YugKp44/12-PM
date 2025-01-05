const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { logger } = require('./logging');

const setupPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/analytics.readonly'
    ]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        accessToken,
        refreshToken
      };
      return done(null, user);
    } catch (error) {
      logger.error('Error in Google strategy callback:', error);
      return done(error, null);
    }
  }));
};

module.exports = { setupPassport };