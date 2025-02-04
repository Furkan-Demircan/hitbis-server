import mongoose, { Schema } from "mongoose";

const CommunitySchema = new Schema({
	name: { type: String, require: true },
	description: { type: String, require: true },
	isPublic: { type: Boolean, default: true },
	contry: { type: Schema.Types.ObjectId, ref: "Country" },
	city: { type: Schema.Types.ObjectId, ref: "City" },
});

export default mongoose.model("Community", CommunitySchema);
