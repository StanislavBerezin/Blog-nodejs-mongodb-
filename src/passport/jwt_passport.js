const passport = require('passport')
const User = require('../models/User')


const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')

const config = require('../config/config')

//can also be a website the request coming from, etc
let options = {
    //this does authentication of the token received
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.auth.jwtExtraSecret
}


//jwt payload is what we signed in authenticationController, basically everything
//then if we find user whose ID matches then we go forward

passport.use(
  new JwtStrategy(options, async function (jwtPayload, done) {
    try {
      //we find a user based on the token received in header
      //however an attacker can use its own token and still pass through.
      //this method doesnt validate against anything, it simply searches for the user, and 
      //if that user exists then proceeds further
      const user = await User.findOne({_id: jwtPayload.user._id})
      
      if (!user) {
        return done(new Error(), false)
      }
      return done(null, user)
    } catch (err) {
      return done(new Error(), false)
    }
  })
)



//because we are simply making a passport object which will be used in IsAuth
module.exports = null