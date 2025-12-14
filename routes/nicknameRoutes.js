const express = require('express');
const router = express.Router();
const { 
    generateNicknameGet, 
    generateNicknamePost,
    generateMultipleNicknames
} = require('../controllers/nicknameController');

// GET маршруты
router.get('/nickname', generateNicknameGet);
router.get('/nickname/:style/:length', generateNicknameGet);

// POST маршруты
router.post('/nickname', generateNicknamePost);
router.post('/nickname/batch', generateMultipleNicknames);

module.exports = router;