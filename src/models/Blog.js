const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,

    },
    content: {
        type: String,
        required: true
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }

    
});

//getting the methods
require('./modelControllers/BlogController')(blogSchema);


module.exports = mongoose.model('Blog', blogSchema);

//need bcrypt, mongoose,