import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	startDate: { type: Date, required: true },
	endDate: { type: Date },
	location: {
		type: new Schema({
			longitude: { type: String, required: true },
			altitude: { type: String, required: true },
		}),
		required: true,
	},
	isActive: { type: Boolean, default: true },
});

export default mongoose.model("Event", EventSchema, "events");
