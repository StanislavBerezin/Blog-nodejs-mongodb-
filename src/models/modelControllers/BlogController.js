
const config = require('../../config/config')





module.exports = function(blogSchema){

//find by token used for authentication
blogSchema.statics.findByCreator = function (creator){
    var Blog = this;

    return Blog.findAll({
        creator
    });

}


}