import { NextFunction, Request, Response } from "express";
import express from "express";
import mongoose from "mongoose";
import User from "../models/user.models";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const multer = require('multer');

const storage = multer.diskStorage({
    // @ts-ignore
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    // @ts-ignore
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})
// @ts-ignore
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    await User.findOne({ email: email }).exec().then(
        user => {
            if (user) {
                return res.status(409).json({
                    message: "user already exists"
                })
            } else {
                bcrypt.hash(password, 10, (err: any, hash: any) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username,
                            email,
                            password: hash,
                            image: req.file?.path
                        })
                        return user.save().then((user) => res.status(201).json({ user })).catch(error => res.status(500).json({ error }))
                    }
                })
            }
        }
    );



}


const loginUser = async (req: Request, res: Response, next: NextFunction) => {

    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
        return res.json({ message: "user not exists" })
    }
    console.log(req.body.password)
    await bcrypt.compare(req.body.password, user.password, (err, result) => {

        if (err) {
            return res.status(401).json({
                error: err,
                message: "Auth failed"
            })
        }
        console.log(result)
        if (result) {
            const token = jwt.sign({
                email: user.email,
                userId: user._id
            },
                "randomString",
                { expiresIn: "1h" }
            )

            return res.status(200).json({

                message: "Auth success",
                token: token
            })
        }
        return res.status(401).json({
            message: "Auth failed"
        })
    });
}



const readUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json({ user })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}
const readAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.find()
        return res.status(200).json({ user })

    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        user.set(req.body)
        return res.status(200).json({ user })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }

}
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json({ message: 'user deleted' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}

export default { createUser, readUser, readAllUser, updateUser, deleteUser, upload, loginUser }