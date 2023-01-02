const User = require('../models/User')
const Results = require('../models/Results')
const Practice = require('../models/Practice')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')








// @desc User registration
// @route POST /users
// @access Private
const userRegistration = asyncHandler(async(req, res) => {
    const { phoneNumber, fullName, age, gender, address, diagnosis, doctorsname, password, roles, active } = req.body

    // Confirm data
    if (!phoneNumber || !fullName || !age || !gender || !diagnosis || !password) {
        return res.status(400).json({ message: 'لطفا فیلد ها ی قرمز * را پر کنید' })
    }
    // Check for duplicate phonenumber
    const duplicate = await User.findOne({ phoneNumber }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'این شماره در سیستم موجود می باشد' })
    }
    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { phoneNumber, fullName, age, gender, address, diagnosis, doctorsname, "password": hashedPwd, roles, active }

    // Create and store new user 
    const newuser = await User.create(userObject)

    if (newuser) { //created 
        res.status(201).json({ message: ` عزیز ثبت نام شما با موفقیت انجام شد${phoneNumber} ` })
    } else {
        res.status(400).json({ message: 'مقادیر وارد شده اشتباه می باشد لطفا با پشتیبانی تماس بگیرید' })
    }

})


// @desc Update a users
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async(req, res) => {
    const { id, phoneNumber, roles, active, password } = req.body

    // Confirm data 
    if (!id || !phoneNumber || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'همه فیلدها به جز رمز عبور الزامی است' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'کاربر پیدا نشد' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ phoneNumber }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate ?._id.toString() !== id) {
        return res.status(409).json({ message: 'نام کاربری تکراری' })
    }

    user.phoneNumber = phoneNumber
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.phoneNumber} به روز شد` })



})










module.exports = {
    userRegistration,
    updateUser

}