import mongoose, { Schema } from "mongoose";

const GroupSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  isPublic: { type: Boolean, default: true },
  countryId: { type: Schema.Types.ObjectId, ref: "Country" },
  cityId: { type: Schema.Types.ObjectId, ref: "City" },
});

GroupSchema.virtual("country", {
  ref: "Country",
  localField: "countryId",
  foreignField: "_id",
  justOne: true,
});

GroupSchema.virtual("city", {
  ref: "City",
  localField: "cityId",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model("Group", GroupSchema);
