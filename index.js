import express from 'express'
import { configDotenv } from 'dotenv';
import cors from 'cors';

import { connectDB } from './config/db.js';
import nodeRoutes from './routes/node.routes.js'
import buildingRoutes from './routes/building.routes.js'
import roomRoutes from './routes/room.routes.js'

configDotenv();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL
}))
app.use(express.json());

app.use('/', (req, res, next) => {
    console.log("api hit")
    next()
})

app.use("/admin/buildings", buildingRoutes)
app.use("/admin/nodes", nodeRoutes)

app.use("/admin/rooms", roomRoutes)

const PORT = process.env.PORT || 3000;

// Mongodb connection
connectDB();

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
