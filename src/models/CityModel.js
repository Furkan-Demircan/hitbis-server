import mongoose, { Schema } from "mongoose";

const CitySchema = new Schema({
	name: { type: String },
	countryId: { type: Schema.Types.ObjectId, required: true, ref: "Country" },
});

export default mongoose.models.City || mongoose.model("City", CitySchema, "cities");
