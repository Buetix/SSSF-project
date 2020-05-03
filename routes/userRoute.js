'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.user_get);

router.post('/create', userController.create_user);


module.exports = router;