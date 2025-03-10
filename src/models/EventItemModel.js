import mongoose, { Schema } from "mongoose";

const EventItemSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAdmin: { type: Boolean, default: false },
});

export default mongoose.model("EventItem", EventItemSchema, "eventItems");
