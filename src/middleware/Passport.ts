import passport from "passport";
import * as passportJWT from "passport-jwt";
import User from "../models/user.models";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const PassportAuth = passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'randomString'
},
    async function (jwtPayload, cb) {
        try {
            const UserId = await User.findById(jwtPayload.userId)
            if (!UserId) {
                return cb({ message: "error" });
            }
            return cb(null, UserId);
        } catch (err) {
            return err
        }
    }

));
export default PassportAuth;