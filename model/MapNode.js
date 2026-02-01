import mongoose from "mongoose"

const connectionSchema = new mongoose.Schema({
    nodeId: { type: String, ref: "MapNode", },
    distance: { type: Number, default: 1 },
},
    { _id: false }
);

const mapNodeSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    floor: { type: Number, required: true },
    buildingId: { type: String, default: null },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    connections: [connectionSchema],
});

const MapNodeModel = mongoose.model("MapNode", mapNodeSchema);

export default MapNodeModel

