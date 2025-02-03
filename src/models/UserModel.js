import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		surname: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		birthDate: {
			type: Date,
		},
		weight: {
			type: Number,
		},
		height: {
			type: Number,
		},
		isSignUpComplete: {
			type: Boolean,
			default: false,
		},
		isBanned: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, collection: "users" }
);

export default mongoose.model("User", userSchema);
