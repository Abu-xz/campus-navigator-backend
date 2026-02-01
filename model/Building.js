import mongoose from "mongoose"

const buildingSchema = new mongoose.Schema({
  name: String,
  shortName: String,
  floors: [Number],
  color: String,
  bounds: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
});

const BuildingModel = mongoose.model("Building", buildingSchema);

export default BuildingModel
