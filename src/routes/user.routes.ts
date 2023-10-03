import express from "express";
import controller from "../controllers/user.controller";
import Passport from "../middleware/Passport";

const router = express.Router();

router.post('/create', controller.upload.single('image'), controller.createUser);
router.get('/get/:userId', Passport.authenticate('jwt', { session: false }), controller.readUser);
router.get('/get', Passport.authenticate('jwt', { session: false }), controller.readAllUser);
router.patch('/update/:userId', Passport.authenticate('jwt', { session: false }), controller.updateUser);
router.delete('/delete/:userId', Passport.authenticate('jwt', { session: false }), controller.deleteUser);
router.post('/login', controller.loginUser);



export default router;