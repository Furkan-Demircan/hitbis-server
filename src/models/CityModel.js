import mongoose, { Schema } from "mongoose";

const CitySchema = new Schema({
	id: { type: String, required: true },
	name: { type: String },
	countryId: { type: String, required: true },
});

export default mongoose.model("City", CitySchema, "cities");
