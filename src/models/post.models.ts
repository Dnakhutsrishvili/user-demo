import mongoose, { Document, Schema } from 'mongoose'

export interface IPost {
    userId: string;
    title: string;
    author: string;
    body: string;
    date: Date,
};
export interface IPostModel extends IPost, Document { };

const postSchema: Schema = new Schema(
    {
        userId: { type: String, required: false },
        title: { type: String, required: false },
        author: { type: String, required: false },
        body: { type: String, required: false },
        date: { type: Date, required: false },

    },

    {
        versionKey: false
    }
)

export default mongoose.model<IPostModel>("post", postSchema);