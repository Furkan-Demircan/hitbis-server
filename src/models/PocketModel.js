import mongoose, { Schema } from "mongoose";

const PocketSchema = new Schema({
	name: { type: String, required: true },
	station: { type: Schema.Types.ObjectId, ref: "Station", required: true },
	isEmpty: { type: Boolean, default: true },
});

export default mongoose.model("Pocket", PocketSchema, "pockets");
