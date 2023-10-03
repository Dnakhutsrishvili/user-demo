import express from "express";
import * as controller from "../controllers/post.controller";
import Passport from "../middleware/Passport";

const router = express.Router();
router.post('/create', Passport.authenticate('jwt', { session: false }), controller.createPost);
router.get('/get/:postId', Passport.authenticate('jwt', { session: false }), controller.readPost);
router.get('/get', Passport.authenticate('jwt', { session: false }),
    controller.readAllPost);
router.get('/getMyPosts', Passport.authenticate('jwt', { session: false }), controller.readMyPosts);
router.patch('/update/:postId', Passport.authenticate('jwt', { session: false }), controller.updatePost);
router.delete('/delete/:postId', Passport.authenticate('jwt', { session: false }), controller.deletePost);


export default router;