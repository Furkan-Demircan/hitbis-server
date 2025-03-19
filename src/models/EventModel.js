import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    location: {
        type: new Schema({
            longitude: { type: String, required: true },
            altitude: { type: String, required: true },
        }),
        required: true,
    },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: false },
});

export default mongoose.model("Event", EventSchema, "events");
