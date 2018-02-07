const Blog = require('../models/Blog')
const mongoose = require('mongoose')

module.exports = {
    async createBlog(req, res){
        try{
            const blog = await new Blog({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                content: req.body.content,
                creator: req.body.creator
            })
            blog.save().then(result =>{
                res.status(201).json(result)
            })
        }
        catch(err){
            res.status(400).json({err})

        }
    },

    async showBlogs(req, res){
        try{
            const {creator} = req.body
            const list = await Blog.find({
                creator
            })
            
            res.status(200).json(list)
        }
        catch(err){
            res.status(401).send(err)

        }
    },

    async updateBlog(req, res){
        try{
            const {name, content} = req.body

            await Blog.findByIdAndUpdate(req.params.blogId, {
                name,
                content
            })
            const updated = await Blog.findById(req.params.blogId)

            res.status(200).json(updated)

        }catch(err){
            res.status(400).send(err)
        }
    },

    async removeBlog(req, res){
        try{
            const deleted = await Blog.findByIdAndRemove(req.params.blogId)
            
            res.status(200).json(deleted)
        }
        catch(err){
            res.status(400).send(err)
        }
        
    }
    
}