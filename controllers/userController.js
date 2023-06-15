const User = require('../models/User')
const bcrypt = require('bcrypt')
exports.update = async (req,res) => {
    const {id} = req.params;
    try {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            if(req.body.password){
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (error) {
                    return res.status(500).json(error)
                }
            }
            try {
                const user = await User.findByIdAndUpdate(id,{$set: req.body})
                await user.save()
                res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
            } catch (error) {
                return res.status(500).json(error)
            }
        }else{
            return res.status(403).json({message:'You can update only your account'})
        }
    } catch (error) {
        
    }
}

exports.delete = async (req,res) => {
    const {id} = req.params;
    try {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            
            try {
                const user = await User.findOneAndDelete(id)
                res.status(200).json({ message: 'Usuario eliminado exitosamente'});
            } catch (error) {
                return res.status(500).json(error)
            }
        }else{
            return res.status(403).json({message:'You can delete only your account'})
        }
    } catch (error) {
        
    }
}

exports.getUserById = async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt,createdAt, ...other}= user._doc
        res.status(200).json(other);
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.getAll = async (req,res) => {
    try {
        const users = await User.find()
        //const {password, updatedAt,createdAt, ...other}= users._doc
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.followUserById = async (req,res) =>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followins:req.params.id}})
                res.status(200).json({message:'You are now a follower of the user'})
            }else {
                res.status(403).json({message:'You are a follower already'})
            }
        } catch (error) {
            return res.status(500).json(error)
        }

    }else{
        req.status(403).res.json({message:'You can not follow yourself'})
    }
}

exports.unfollowUserById = async (req,res) =>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followins:req.params.id}})
                res.status(200).json({message:'You are not a follower of the user'})
            }else {
                res.status(403).json({message:'You are a unfollower already'})
            }
        } catch (error) {
            return res.status(500).json(error)
        }

    }else{
        req.status(403).res.json({message:'You can not unfollow yourself'})
    }
}