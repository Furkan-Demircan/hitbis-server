import mongoose, { Schema } from "mongoose";

const EventItemSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAdmin: { type: Boolean, default: false },
    isLeave: { type: Boolean, default: false },
});

export default mongoose.model("EventItem", EventItemSchema, "eventItems");
