import mongoose, { Schema } from "mongoose";

const GroupItemSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
});

export default mongoose.model("GroupItem", GroupItemSchema);
