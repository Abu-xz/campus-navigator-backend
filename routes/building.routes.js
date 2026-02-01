import express from 'express'
import BuildingModel from '../model/Building.js';

const router = express.Router();

router.get("/", async (req, res) => {

    console.log("buildings api hit")

    try {
        const buildings = await BuildingModel.find();
        if (buildings) {
            const responseData = buildings.map(((b) => {
                return {
                    id: b._id,
                    name: b.name,
                    shortName: b.shortName,
                    floors: b.floors,
                    color: b.color,
                    bounds: b.bounds,
                }
            }))
            return res.status(200).json({ success: true, message: "Retrieved buildings", data: responseData })
        }



    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

router.post('/create-building', async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        const createdBuilding = await BuildingModel.create(data);
        return res.status(201).json({ success: true, message: "building created", data: createdBuilding })
    } catch (error) {
        res.status(400).json({ success: false, message: "Bad request", error: error })
    }
})

router.get("/buildings", () => { })


export default router;