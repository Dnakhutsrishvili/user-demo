import mongoose, { Document, Schema } from 'mongoose'

export interface Iuser {
    username: string;
    email: string;
    password: string;
    image: string;
};
export interface IUserModel extends Iuser, Document { };

const UserSchema: Schema = new Schema(
    {
        username: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
        email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
        password: { type: String, required: true },
        image: { type: String, required: false }
    },

    {
        versionKey: false
    }
)

export default mongoose.model<IUserModel>("user", UserSchema);