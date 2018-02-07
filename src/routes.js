const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationPolicy = require('./policies/AuthenticationPolicy')
const BlogController = require('./controllers/BlogController')


const IsAuth = require('./policies/IsAuth')
const passport = require('passport')
/*
C - Create - POST
R - Read - GET
U - Update - PUT
D - Delete - DELETE
*/


module.exports = (app) => {
    //good
    app.post('/registerUser',
      AuthenticationPolicy.validateRegister,
      AuthenticationController.registerUser  )

    //good
    app.post('/loginUser', 
        AuthenticationPolicy.validateLogin,
        AuthenticationController.loginUser)


    //IsAuth.customAuth is a middleware that always requires a creator to procceed further
    //for example whenever we create blog, showing blogs, updating, or deleting we will always need a cretor

    //IsAuth.jwtAuthCheck -- is a middleware that is not checking against anything, it simply scans for the user, 
    //and if that user exists then it proceeds further.

    app.post('/createBlog',
        IsAuth.customAuth,
        IsAuth.jwtAuthCheck, 
        BlogController.createBlog)

   
    app.post('/showBlogs', 
        IsAuth.jwtAuthCheck,
        IsAuth.customAuth,
        BlogController.showBlogs),

    
    
    app.put('/update/:blogId',
        IsAuth.customAuth,
        IsAuth.jwtAuthCheck,
        BlogController.updateBlog),

    app.delete('/delete/:blogId',
        IsAuth.customAuth,
        IsAuth.jwtAuthCheck,
        BlogController.removeBlog)



  

}