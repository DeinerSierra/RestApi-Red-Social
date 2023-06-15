const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

router.post('/create', postController.create)
router.get('/getAll', postController.getAll)
router.get('/get/:id', postController.getById)
router.put('/update/:id', postController.updateById)
router.delete('/delete/:id', postController.deleteById)
router.put('/:id/like', postController.like)

module.exports = router;