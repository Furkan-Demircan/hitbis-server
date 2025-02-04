import mongoose, { Schema } from "mongoose";

const StationSchema = new Schema({
	name: { type: String, required: true },
	country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
	city: { type: Schema.Types.ObjectId, ref: "City", required: true },
});

export default mongoose.model("Station", StationSchema, "stations");
