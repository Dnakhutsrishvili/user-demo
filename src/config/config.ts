import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = `mongodb://localhost:27017/user-post-demo`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
}