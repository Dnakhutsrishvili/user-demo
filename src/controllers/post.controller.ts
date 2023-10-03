import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/post.models";



export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, body } = req.body;
        //@ts-ignore
        const userId = req.user._id;
        //@ts-ignore
        const author = req.user.username;
        console.log(req.user)
        const post = await new Post({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            title,
            author: author,
            body,
            date: Date.now(),
        });

        if (!post) {
            return res.status(500).json({ message: "error" });
        }
        post.save();
        return res.status(201).json({ post });
    } catch (err) {
        return res.status(500).json({ error: err })
    }

}


export const readPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.postId)
        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }
        return res.status(200).json({ post })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}
export const readAllPost = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const posts = await Post.find()
        return res.status(200).json({ posts })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}
export const readMyPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find()
        //@ts-ignore
        const myPosts = posts.filter((post) => { return post.userId == req.user._id })
        if (myPosts.length < 1) {
            return res.status(500).json({ message: "user doesn't have posts" })

        }
        return res.status(200).json({ myPosts })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId;
        const postTitle = req.body.title;
        const postBody = req.body.body;
        const post = await Post.findByIdAndUpdate(postId, {
            title: postTitle,
            body: postBody
        })
        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }
        return res.status(200).json({ message: "post updated" })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }

}
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.postId)
        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }
        return res.status(200).json({ message: 'post deleted' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}

