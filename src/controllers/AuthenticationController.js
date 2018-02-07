//importing models and other things that are needed
//when working with routes (responses and requests)
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const config = require('../config/config')
const mongoose = require('mongoose')
var _ = require('lodash');


//what we sign here is recovered in jwt-passport.js file in a form of jwtPayload
function generateToken(req, user) {
    var token = jwt.sign({
        user,
        auth: config.auth.jwtExtraSecret,
        agent: req.headers['user-agent'],
        exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
    }, config.auth.jwtExtraSecret);

    return token;
}

//function to chose what things we want to send back to the client
function sendData(userObject, ...parameteres) {
    const userToObject = userObject.toObject()
    return _.pick(userToObject, [...parameteres])

}

//validationg token 
//i havent implemented the use of it yet, because didnt make any routes for that
function validateToken(req, res) {
    var token = req.headers.authorization;
    try {
        var decoded = jwt.verify(token, config.auth.jwtSecret);
    } catch (e) {
        return authFail(res);
    }
    if (!decoded || decoded.auth !== 'magic') {
        return authFail(res);
    } else {
        return privado(res, token);
    }
}



module.exports = {

    async registerUser(req, res) {
        //we try
        try {
            //storing variable email and username for req.body
            const {email, username } = req.body

            //looking for user in DB to check if somebody is registered already
            const checkUser = await User.findOne({
                email,
                username
            })

            //if we find it, we sen 400, and saying the user is regisrered already
            if (checkUser) {
                return res.status(400).send({
                    error: "This user is already registered"
                })
            }

            //if no user, we create the user based on the object
            const user = await new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
               
            })
           
            //then we save the user
            user.save()
            //right after we saved it, we generation the token
                .then(() => {
                   
                    return user.generateAuthToken()

                })
                // .then(()=>{
                //     return user.expiryToken(req, user)
                // })
                //after creating the token we send data back to the user
                .then(() => {
                     const userJson = user.toJSON()
                    //using function sendData we chose what data to send
                    res.send({
                        user: sendData(user, 'username','tokens','_id'),
                        extraToken: generateToken(req, userJson),
                       
                    })
                })

                //if something happened we do it here
                .catch((err) => {

                    res.status(400).send({
                        error: "Somethng went wrong with registration"
                    })

                })

                //if something happened globally then we also send the error
        } catch (err) {

            res.status(500).send({
                error: "Something happened on global level in saving"
            })

        }

    },


    async loginUser(req, res) {

        //at first we try
        try {
            //getting the variable of email and password
            const {email,password} = req.body
            
            //creating user and waiting to find it in the db
            const user = await User.findOne({
                email: req.body.email
            })

            //if no user then the details are wrong and email is wrong
            if (!user) {
                return res.status(403).send({
                    error: "Incorrect details"
                })
            }
            //if there is a user then we compare password the function compare password is in user obect, see userController
            //for more
            const isPassValid = await user.comparePassword(password)

            //if password is wrong we send 403
            if (!isPassValid) {
                return res.status(403).send({
                    error: "Incorrect details pass"
                })
            }

            //if all good we create a token seeUserController for that
            await user.generateAuthToken()

            const userJson = user.toJSON()
            //then we use sendData function, to chose explicitly of what we want to send
            //in this case username, university and token, can be changed at the later stage if required
            res.send({
                user: sendData(user, 'username', 'university', 'tokens'),
                extraToken: generateToken(req, userJson)
            })



            //if something went wrong we send 403
        } catch (err) {
            res.status(403).send({
                error: "Inavlid login details ss"
            })
        }


    }


}