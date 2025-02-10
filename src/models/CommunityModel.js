import mongoose, { Schema } from "mongoose";

const CommunitySchema = new Schema({
	name: { type: String, require: true },
	description: { type: String, require: true },
	isPublic: { type: Boolean, default: true },
	countryId: { type: Schema.Types.ObjectId, ref: "Country" },
	cityId: { type: Schema.Types.ObjectId, ref: "City" },
});

CommunitySchema.virtual("country", {
	ref: "Country",
	localField: "countryId",
	foreignField: "_id",
	justOne: true,
});

CommunitySchema.virtual("city", {
	ref: "City",
	localField: "cityId",
	foreignField: "_id",
	justOne: true,
});

export default mongoose.model("Community", CommunitySchema);
