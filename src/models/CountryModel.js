import mongoose, { Schema } from "mongoose";

const CountrySchema = new Schema({
	id: { type: String, required: true },
	name: { type: String },
});

export default mongoose.model("Country", CountrySchema, "countries");
