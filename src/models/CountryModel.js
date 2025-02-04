import mongoose, { Schema } from "mongoose";

const CountrySchema = new Schema({
	name: { type: String },
});

export default mongoose.model("Country", CountrySchema, "countries");
