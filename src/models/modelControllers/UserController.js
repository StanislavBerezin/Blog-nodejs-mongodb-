const bcrypt = require('bcrypt');
const config = require('../../config/config')
const jwt = require('jsonwebtoken')




module.exports = function(userSchema){

//making a token for the user/ if one exist need to remove it and assign a new one
userSchema.methods.generateAuthToken = function(){
    var user = this;
    
    var access = config.auth.jwtSecret;
    
    var token = jwt.sign(
        {_id: user._id.toHexString(), 
            access}, 
            config.auth.jwtFindBy).toString();

    
   user.tokens.pop({access, token})
    user.tokens.push({
        access,
        token
    });

   
    return user.save().then(()=>{
        return token;
    });
},


//comparing passwords
userSchema.methods.comparePassword = function(password){
    let user = this;
    return bcrypt.compareSync(password, user.password)
  
},

userSchema.methods.removeToken = function(token){
    let user = this;

    return user.update({
        $pull:{
            tokens:{token}
        }
    })
}
//find by token used for authentication
userSchema.statics.findByToken = function (token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, config.auth.jwtFindBy);
    }catch(e){
        return Promise.reject();

    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': config.auth.jwtSecret
    });

},


//before saving to db salt the password
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password') || user.isNew){

        bcrypt.genSalt(10, (err, salt)=>{

            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            })

        });
    }else{
        next();
    }
})





}