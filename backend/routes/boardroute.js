const express = require('express');
const { create, read, edit, deletes } = require('../controllers/boardcontroller');

const router = express.Router();

router.post('/board/create', create);   
router.get('/board/read', read);        
router.put('/board/edit', edit);        
router.delete('/board/delete', deletes); 

module.exports = router;
