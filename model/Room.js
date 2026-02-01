import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    buildingId: { type: String, required: true },
    floor: { type: Number, required: true },
    nodeId: { type: String, ref: "MapNode", required: true },
    category: { type: String, required: true },
});

const RoomModel = mongoose.model("Room", roomSchema);

export default RoomModel;