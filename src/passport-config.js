const { authenticate } = require('passport')
const models = require('./models')
const {Op} = require('@sequelize/core')
const bcrypt = require('bcrypt')
const LocalStategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = async (Email, Password, done) => {
        var user;
        if (Email.search("@") != -1){
            user = await models.User.findOne({ where: 
                {email: {
                    [Op.like]: Email + "%"}}}
                );
            if (user){
                if (user.email.search("%") != -1){
                    console.log("Not verify")
                    return done(null, false, { message: 'Your email is not verified. <br> Verify it through Forgot Password -> verify it now' })
                }
            }
        } else {
            user = await models.User.findOne({ where: 
                { [Op.or]:
                    {username: Email,
                     email: Email
                    }}});
        }
            
        console.log(JSON.stringify(user))
        if (user == null) {
            console.log('No user with that username or email')
            return done(null, false, { message: 'No user with that username or email' })
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
        console.log(user_id)
        return done(null, user_id)
    })
}

module.exports = initialize