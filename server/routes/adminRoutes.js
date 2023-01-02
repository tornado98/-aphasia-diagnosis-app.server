const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')

router.route('/')
    .get(adminController.getAllUsers)
    .post(adminController.createNewUser)
    .patch(adminController.updateUser)
    .delete(adminController.deleteUser)


module.exports = router