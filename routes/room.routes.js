import express from 'express'
import RoomModel from '../model/Room.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const rooms = await RoomModel.find();
        if (rooms) {
            return res.status(200).json({ success: false, message: "Retrieved map nodes", data: rooms })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

router.post("/create-room", async (req, res) => {
    console.log("create room api hit")
    const data = req.body;

    console.log(data)

    try {
        const createdRoom = await RoomModel.create(data)
        return res.status(201).json({ success: true, message: "Node room", data: createdRoom })

    } catch (error) {
        res.status(400).json({ success: false, message: "Bad request", error: error })
    }

})

export default router;