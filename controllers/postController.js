const Post = require('../models/Post');
const User = require('../models/User');

exports.create = async (req, res) =>{
    const nuewPost = new Post(req.body);
    try {
        const savedPost = await nuewPost.save();
        res.status(201).json({ message: 'Post created seccessfully', savedPost });
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.getAll = async (req, res) =>{
    let postArray = [];
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id})
        const friendsPosts = await Promise.all(
            currentUser.followins.map((friendId)=>{
                return Post.find({userId:friendId})
            })
        )
        res.json(userPosts.concat(...friendsPosts))
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.getById = async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        
        res.status(200).json(post);
        
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.updateById = async (req, res) =>{   
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            const postsaved = await post.updateOne({$set: req.body})
            res.status(201).json({ message: 'Post updated seccessfully',postsaved });
        } else {
            return res.status(403).json({message:'You can update only your posts'})
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.deleteById = async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json({ message: 'Post deleted seccessfully'});
        } else {
            return res.status(403).json({message:'You can delete only your posts'})
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.like = async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push:{likes: req.body.userId}})
            res.status(200).json({ message: 'You like this post'});
        } else {
            await post.updateOne({$pull:{likes: req.body.userId}})
            res.status(200).json({ message: 'You dont like this post anymore'});
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}