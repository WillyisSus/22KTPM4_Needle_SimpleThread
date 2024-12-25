const { authenticate } = require('passport')
const models = require('./models')
const bcrypt = require('bcrypt')
const LocalStategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = async (Email, Password, done) => {
        const user = await models.User.findOne({ where: { username: Email } });
        if (user == null) {
            console.log('No user with that username')
            return done(null, false, { message: 'No user with that username' })
        }
        try {
            if (await bcrypt.compareSync(Password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStategy({ usernameField: 'Email', passwordField: 'Password' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, models.User.findOne({ where: { id: id } }))
    })
}

module.exports = initialize