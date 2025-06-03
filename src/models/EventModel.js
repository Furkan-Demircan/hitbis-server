import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: {
        type: Date,
        required: true,
    },
    location: {
        type: new Schema({
            longitude: { type: String, required: true },
            latitude: { type: String, required: true },
        }),
        required: true,
    },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium",
    },
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: false },
    imageUrl: {
        type: String,
        default:
            "https://res.cloudinary.com/dcjfzpzpb/image/upload/v1748876730/ChatGPT_Image_2_Haz_2025_18_04_56_1_jk6pg3.png",
    },
});

export default mongoose.model("Event", EventSchema, "events");
