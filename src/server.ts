import { config } from "./config/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";

// import { Queue, Worker } from 'bullmq'

// // Create a new connection in every instance
// const myQueue = new Queue('myqueue', {
//     connection: {
//         host: "127.0.0.1",
//         port: 6379
//     }
// });
// myQueue.on('error', (error) => {
//     console.error('Queue Error:', error);
// });

// const myWorker = new Worker('myqueue', async (job) => { }, {
//     connection: {
//         host: "127.0.0.1",
//         port: 6379
//     }
// });;
// import { Queue, Worker } from 'bullmq';
// import IORedis from 'ioredis';

// const connection = new IORedis({
//     maxRetriesPerRequest: null,

// });

// // Reuse the ioredis instance
// const myQueue = new Queue('myqueue', { connection });
// const myWorker = new Worker('myqueue', async (job) => { }, { connection });





const router = express();

mongoose.connect(config.mongo.url, { retryWrites: true, w: "majority" }).then(() => {
    console.log("connected")
    startServer()
}).catch((err) => {
    console.log(err)
})

const startServer = () => {
    router.use((req, res, next) => {
        res.on("finish", () => {
            console.log(res.statusCode)
        })
        next();
    })
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());
    router.use('/uploads', express.static('uploads'));


    /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });






    router.use('/users', userRouter)
    router.use('/posts', postRouter)

    http.createServer(router).listen(config.server.port, () => console.log(`Server is running on port ${config.server.port}`));


}