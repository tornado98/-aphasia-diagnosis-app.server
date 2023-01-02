const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');




router.route('/')
    .post(userController.userRegistration)
    .patch(userController.updateUser)


module.exports = router