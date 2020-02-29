import mongoose from 'mongoose'
import keys from '../config/keys'

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = mongoose.model("users")


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

export default passport => {
    passport.use(
        new JwtStrategy(opts, (jwp_payload, done) => {
            User.findById(jwp_payload.id)
              .then(user => {
                  if (user) {
                      return done(null, user)
                  }
                  return done(null, false)
              })
              .catch(err => console.log(err))
        })
    )
}