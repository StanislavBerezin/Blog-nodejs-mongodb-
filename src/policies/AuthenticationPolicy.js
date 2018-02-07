//can import the models to work with
const Joi = require('joi')

module.exports = {



    validateRegister(req, res, next) {
        //can add more //check joy
        const schema = {
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{6,32}') //from a to a, from A to Z, from 0 to 9, at least 8-32 chars
            )
        
        }
        //comparing body and schema
        Joi.validate(req.body, schema, function (error, value) {

            //in case something happend
            if (error) {

                //this allows us to see what key element in schema failed
                switch (error.details[0].context.key) {
                    case 'email':
                        res.status(400).send({
                            error: 'Bad email address'
                        })
                        break
                    case 'username':
                        res.status(400).send({
                            error: 'Your username should be at least 3-30 characters long'
                        })
                        break
                    case 'password':
                        res.status(400).send({
                            error: 'You password should be at least 6-32 charaters long'
                        })
                        break
                    default:
                        res.status(400).send({
                            error: 'Wrong data'
                        })
                }
            } else {
                next();
            }
        })
    },

    validateLogin(req,res,next){
        const schema = {
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{6,32}') 
            )}
        //comparing body and schema
        Joi.validate(req.body, schema, function (error, value) {

            //in case something happend
            if (error) {

                //this allows us to see what key element in schema failed
                switch (error.details[0].context.key) {
                    case 'email':
                        res.status(400).send({
                            error: 'Bad email addressa'
                        })
                        break
                    case 'password':
                        res.status(400).send({
                            error: 'You password should be at least 6-32 charaters long'
                        })
                        break
                    default:
                        res.status(400).send({
                            error: 'Wrong data'
                        })
                }
            } else {
                next();
            }
        })
        

    }
}