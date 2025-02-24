import mongoose, { Schema } from "mongoose";

const CommunityItemSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  communityId: { type: Schema.Types.ObjectId, ref: "Community" },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
});

export default mongoose.model("CommunityItem", CommunityItemSchema);
