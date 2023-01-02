const User = require('../models/User')
const Results = require('../models/Results')
const Practice = require('../models/Practice')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'کاربری پیدا نشد' })
    }
    res.json(users)

})

// @desc Create new user //*for ADMIN*//
// @route GET /users
// @access Private
const createNewUser = asyncHandler(async(req, res) => {
    const { phoneNumber, fullName, age, gender, address, diagnosis, doctorsname, password, roles, active } = req.body

    // Confirm data
    if (!phoneNumber || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'لطفا فیلد ها ی قرمز * را پر کنید' })
    }
    // Check for duplicate phonenumber
    const duplicate = await User.findOne({ phoneNumber }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'این شماره در سیستم موجود می باشد' })
    }
    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const adminuserObject = { phoneNumber, fullName, age, gender, address, diagnosis, doctorsname, "password": hashedPwd, roles, active }

    // Create and store new user 
    const adminnewuser = await User.create(adminuserObject)

    if (adminnewuser) { //created 
        res.status(201).json({ message: ` ایجاد شد${phoneNumber} ` })
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


// @desc Delete a users
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async(req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'شناسه کاربری مورد نیاز است' })
    }

    // Does the user still have assigned Results?
    const results = await Results.findOne({ user: id }).lean().exec()
    if (results) {
        return res.status(400).json({ message: 'کاربر نتایج را اختصاص داده است' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'کاربر پیدا نشد' })
    }

    const result = await user.deleteOne()

    const reply = `phoneNumber ${result.phoneNumber} این کاربر حذف شد ${result._id}  `

    res.json(reply)
})




module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser

}