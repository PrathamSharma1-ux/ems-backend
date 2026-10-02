const express = require('express')
const router = express.Router()
const zod = require("zod")
const jwt = require('jsonwebtoken')
const { UserModel } = require('../database')
const authMiddleware = require("../middleware/auth")


// ==================== SIGNUP ====================

const signUp = zod.object({
    userName: zod.string().email().regex(
        /^[A-Za-z0-9._%+-]{2,}@gmail\.com$/,
        "please enter valid Email addess"
    ),
    fName: zod.string().max(50).regex(
        /^[A-Za-z]{2,}$/,
        "please enter atleast 2 charcters"
    ),
    lName: zod.string().max(50).regex(
        /^[A-Za-z]{2,}$/,
        "plzz enter atleast 2 charcters"
    ),
    password: zod.string().min(
        8,
        "password should be atlest 8 characters long"
    )
})


router.post("/signup", async (req, res) => {

    const signUpData = signUp.safeParse(req.body)

    console.log("ZOD ERROR:", signUpData.error)

    if (!signUpData.success) {
        return res.status(400).json({
            msg: "invalid inputs!!"
        })
    } 
    else {

        const ExistingUser = await UserModel.findOne({
            userName: req.body.userName
        })

        if (ExistingUser) {
            return res.status(409).json({
                msg: "username already registered try another one !!"
            })
        }

        const createUser = new UserModel({
            userName: req.body.userName,
            fName: req.body.fName,
            lName: req.body.lName,
            password: req.body.password,
            
        })

        await createUser.save()

        const token = jwt.sign({
            userId: createUser._id
        }, process.env.JWT_SECRET)

        res.status(201).json({
            msg: "user created sucessufully!",
            token: token
        })
    }
})


// ==================== SIGNIN ====================

const signIn_schema = zod.object({
    userName: zod.string().email(),
    password: zod.string().min(
        8,
        "password should atleast 8 charters long"
    )
})


router.post("/signIn", async (req, res) => {

    const result = signIn_schema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({
            msg: "invalid inputs!!"
        })
    }

    const registeredUser = await UserModel.findOne({
        userName: req.body.userName,
        password: req.body.password
    })

    if (registeredUser) {

        const token = jwt.sign({
            userId: registeredUser._id
        }, process.env.JWT_SECRET)

        return res.status(200).json({
            msg: "user founded",
            token: token
        })
    }

    res.status(401).json({
        msg: "first signUp"
    })
})


// ==================== EDIT PROFILE ====================

router.put("/userProfile", authMiddleware, async (req, res) => {

    try {

        const user = await UserModel.findById(req.user.userId)

        if (!user) {
            return res.status(404).json({
                msg: "user not found"
            })
        }

        if (req.body.fName) {
            user.fName = req.body.fName
        }

        if (req.body.lName) {
            user.lName = req.body.lName
        }

        if (req.body.userName) {
            user.userName = req.body.userName
        }

        await user.save()

        return res.status(200).json({
            msg: "profile updated successfully"
        })

    } 
    catch (e) {

        console.log("error occured while updating profile", e)

        if (e.code === 11000) {
            return res.status(409).json({
                msg: "username already registered try another one !!"
            })
        }

        return res.status(400).json({
            msg: "error occured while updating profile"
        })
    }
})


// GET PROFILE 

router.get("/profile", authMiddleware, async (req, res) => {

    try {

        const user = await UserModel.findById(req.user.userId)

        if (!user) {
            return res.status(404).json({
                msg: "user not found"
            })
        }

        return res.status(200).json({
            user: {
                userName: user.userName,
                fName: user.fName,
                lName: user.lName
            }
        })

    } 
    catch (e) {

        console.log("error occured while getting profile", e)

        return res.status(400).json({
            msg: "error occured while getting profile"
        })
    }
})


module.exports = router