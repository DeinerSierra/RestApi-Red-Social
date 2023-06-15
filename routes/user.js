const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
router.put('/update/:id',userController.update)
router.delete('/delete/:id',userController.delete)
router.get('/users',userController.getAll)
router.get('/:id',userController.getUserById)
router.put('/:id/follow',userController.followUserById)
router.put('/:id/unfollow',userController.unfollowUserById)
module.exports = router;