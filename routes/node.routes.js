import express from 'express'
import mongoose from 'mongoose';
import MapNodeModel from '../model/MapNode.js';

const router = express.Router();

/*
* List Nodes api route handler
*/
router.get("/", async (req, res) => {
    const { buildingId, floor = 0 } = req.query
    console.log("buildingId: ", buildingId)

    const query = buildingId !== undefined ? {
        buildingId: buildingId, floor
    } : { buildingId: "", floor }

    try {
        const nodes = await MapNodeModel.find(query)

        if (nodes) {
            const responseData = nodes.map(n => {
                return {
                    id: n._id,
                    name: n.name,
                    type: n.type,
                    buildingId: n.buildingId,
                    floor: n.floor,
                    x: n.x,
                    y: n.y,
                    connections: n.connections.map((c) => {
                        return { nodeId: c.nodeId, weight: c.distance }
                    })

                }
            })
            return res.status(200).json({ success: true, message: "Retrieved map nodes", data: responseData })
        } else {
            return res.status(200).json({ success: true, message: "cannot find nodes" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error })

    }
});

/*
* Create Node Api route handler
*/
router.post("/create-node", async (req, res) => {
    console.log("create node api hit")
    const data = req.body;
    console.log(data)
    try {
        const createdNode = await MapNodeModel.create(data)
        if (!createdNode) {
            return res.status(400).json({ success: false, message: "Bad request" })
        }

        const responseData = {
            id: createdNode._id,
            name: createdNode.name,
            type: createdNode.type,
            buildingId: createdNode.buildingId,
            floor: createdNode.floor,
            x: createdNode.x,
            y: createdNode.y,
            connections: createdNode.connections.map((c) => {
                return { nodeId: c.nodeId, weight: c.distance }
            })

        }
        return res.status(201).json({ success: true, message: "Node created", data: responseData })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error", error: error })

    }
});


/*
* Add Connection between nodes Api route handler
*/

router.post("/add-connections", async (req, res) => {
    console.log("add connection api hit")

    try {
        const { weight, fromNodeId, toNodeId } = req.body;

        if (!fromNodeId || !toNodeId) {
            return res.status(400).json({ message: "Missing node ids" });
        }
        console.log("connection data: ", req.body);

        // Add connection to FROM node

        const updatedFromNode = await MapNodeModel.updateOne({
            _id: new mongoose.Types.ObjectId(fromNodeId)
        }, {
            $addToSet: {
                connections: { nodeId: toNodeId, distance: weight }
            }
        })

        // Add reverse connection to To Node 
        const updatedToNode = await MapNodeModel.updateOne({
            _id: new mongoose.Types.ObjectId(toNodeId)
        }, {
            $addToSet: {
                connections: { nodeId: fromNodeId, distance: weight }
            }
        })

        return res.status(200).json({
            success: true, message: "Node connected successfully", data: { updatedFromNode, updatedToNode }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
});


/*
* Delete Node nodes Api route handler
*/

router.delete("/:nodeId", async (req, res) => {
    console.log("Delete node api hit")
    const nodeId = req.params.nodeId
    try {

        await MapNodeModel.updateMany({ 'connections.nodeId': nodeId },
            {
                $pull: {
                    connections: { nodeId: nodeId }
                }
            })
        await MapNodeModel.findByIdAndDelete(
            new mongoose.Types.ObjectId(nodeId)
        )

        return res.status(200).json({
            success: true,
            message: "Node deleted and connections cleaned",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error", error: error })

    }
});


/*
 * Update Node API route handler
 */
router.put("/update-node/:nodeId", async (req, res) => {
    console.log("Update node api hit🚀")
    const nodeId = req.params.nodeId;
    const data = req.body;

    try {
        // 1️⃣ Basic validation
        if (!nodeId) {
            return res.status(400).json({
                success: false,
                message: "Node id missing",
            });
        }

        // 2️⃣ Prevent self connections
        const cleanedConnections = (data.connections || [])
            .filter((c) => c.nodeId !== nodeId)
            .map((c) => ({
                nodeId: c.nodeId,
                distance: c.weight || 1,
            }));

        // 3️⃣ Update node
        const updatedNode = await MapNodeModel.findByIdAndUpdate(
            nodeId,
            {
                name: data.name,
                type: data.type,
                floor: data.floor,
                buildingId: data.buildingId,
                x: data.x,
                y: data.y,
                connections: cleanedConnections,
            },
            { new: true }
        );

        if (!updatedNode) {
            return res.status(404).json({
                success: false,
                message: "Node not found",
            });
        }

        // 4️⃣ Format response for frontend
        const responseData = {
            id: updatedNode._id,
            name: updatedNode.name,
            type: updatedNode.type,
            buildingId: updatedNode.buildingId,
            floor: updatedNode.floor,
            x: updatedNode.x,
            y: updatedNode.y,
            connections: updatedNode.connections.map((c) => ({
                nodeId: c.nodeId,
                weight: c.distance,
            })),
        };

        return res.status(200).json({
            success: true,
            message: "Node updated successfully",
            data: responseData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});


export default router;