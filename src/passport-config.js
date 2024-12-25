const { authenticate } = require('passport')
const models = require('./models')
const {Op} = require('@sequelize/core')
const bcrypt = require('bcrypt')
const LocalStategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = async (Email, Password, done) => {
        const user = await models.User.findOne({ where: 
            { [Op.or]:
                {username: Email,
                 email: Email
                }}});
        console.log(JSON.stringify(user))
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
    passport.use(new LocalStategy({ usernameField: 'Email', passwordField: 'Password'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.user_id))
    passport.deserializeUser((user_id, done) => {
        return done(null, user_id)
    })
}

module.exports = initialize