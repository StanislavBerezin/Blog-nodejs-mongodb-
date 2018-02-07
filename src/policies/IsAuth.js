


const passport = require('passport')


const User = require('../models/User')

module.exports =  {

    //if we find a user then all good and we set req.user to user
    //therefore req.user now can be accessed from the route that is using this middleware
    jwtAuthCheck(req, res, next) {
        passport.authenticate('jwt', function (error, user) {

            if (error || !user) {
                res.status(403).send({
                    message: 'you dont have an access'
                })

            } else {

                req.user = user
                next();

            }


        })(req, res, next)
    },

    //we get a token in x-auth header and finding a user. Then we find a user based on another property
    //which is creator, if those 2 user tokens match, then we can proceed further. Coz we know that it all belongs
    //to one user
    async customAuth(req, res, next) {
        let token = req.header('x-auth');
        try{
            const userByToken = await User.findByToken(token)

            const userByCreator = await User.findOne({_id: req.body.creator})

            if (!userByToken || !userByCreator) {
                throw new Error("missing userByToken or userByCreator")
            }            

            else if(userByToken.tokens[0].token !== userByCreator.tokens[0].token){
                throw new Error("missing userByToken or userByCreator")
            }
                       
            next()

        }catch(err){
            console.log(token )

            res.status(401).send("wont work")
    
        }
     


    }



}