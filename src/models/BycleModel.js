import mongoose, { Schema } from "mongoose";

const BycleSchema = new Schema({
	name: { String, required: true },
	brand: { type: String, required: true },
	maxSpeed: { type: String, default: "40 Kmh" },
	wheelSize: { type: String, required: true },
	gear: { type: String, default: "Unknown" },
	isUsable: { type: Boolean, default: true },
});

export default mongoose.model("Bycle", BycleSchema, "bycles");
