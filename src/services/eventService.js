import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import GroupModel from "../models/GroupModel.js";
import GroupItemModel from "../models/GroupItemModel.js";
import EventModel from "../models/EventModel.js";
import { EventInfoDtos } from "../dto/eventDtos.js";
import EventItemModel from "../models/EventItemModel.js";
import { ProfileInfoDto } from "../dto/userDtos.js";

const createEvent = async (groupId, adminId, eventData) => {
    try {
        const group = await GroupModel.findOne({ _id: groupId });

        if (!group) {
            return new ErrorResponse(404, "Group not found");
        }

        const existingAdmin = await GroupItemModel.findOne({
            groupId: groupId,
            userId: adminId,
            isAdmin: true,
        });

        if (!existingAdmin) {
            return new ErrorResponse(401, "You do not have permission");
        }

        const existingEvent = await EventModel.findOne({
            groupId: groupId,
            isActive: true,
        });

        if (existingEvent) {
            return new ErrorResponse(400, "There is already an active event");
        }

        const createEventResult = await EventModel.create({
            groupId: groupId,
            ...eventData,
        });

        const addAdminResult = await EventItemModel.create({
            eventId: createEventResult._id,
            userId: adminId,
            isAdmin: true,
        });

        return new SuccessResponse(addAdminResult, "Event created", null);
    } catch (error) {
        console.error("Error creating event:", error);
        return new ErrorResponse(500, "Something went wrong");
    }
};

const getEventById = async (eventId) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });
        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        const eventData = new EventInfoDtos(
            event._id,
            event.title,
            event.description,
            event.startDate,
            event.location,
            event.isActive,
            event.difficulty,
            event.imageUrl
        );

        return new SuccessResponse(eventData, "Event found", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const getAllEvents = async (groupId) => {
    try {
        const events = await EventModel.find({ groupId: groupId });
        if (!events) {
            return new ErrorResponse(404, "No events found");
        }

        const eventData = events.map((event) => {
            return new EventInfoDtos(
                event._id,
                event.title,
                event.description,
                event.startDate,
                event.location,
                event.isActive,
                event.difficulty,
                event.imageUrl
            );
        });

        return new SuccessResponse(eventData, "Events found", eventData.length);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const updateEvent = async (eventId, userId, data) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });
        const isAdmin = await GroupItemModel.findOne({
            groupId: event.groupId,
            userId: userId,
            isAdmin: true,
        });

        const existingEventTitle = await EventModel.findOne({
            groupId: event.groupId,
            title: data.title,
            isActive: true,
        });

        if (!isAdmin) {
            return new ErrorResponse(401, "You do not have permission");
        }

        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        if (existingEventTitle) {
            return new ErrorResponse(400, "Event title already exists");
        }

        await EventModel.updateOne({ _id: eventId }, { $set: data });

        return new SuccessResponse(true, "Event updated", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const deleteEvent = async (eventId, userId) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });
        const isAdmin = await GroupItemModel.findOne({
            groupId: event.groupId,
            userId: userId,
            isAdmin: true,
        });

        if (!isAdmin) {
            return new ErrorResponse(401, "You do not have permission");
        }

        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        const deleteResult = await EventModel.updateOne(
            { _id: eventId },
            { $set: { isActive: false } }
        );

        return new SuccessResponse(deleteResult, "Event deleted", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const joinEvent = async (eventId, userId) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });

        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        const isGroupUser = await GroupItemModel.findOne({
            groupId: event.groupId,
            userId: userId,
        });

        if (!isGroupUser) {
            return new ErrorResponse(401, "You do not have permission");
        }

        const existingUser = await EventItemModel.findOne({
            eventId: eventId,
            userId: userId,
            isLeave: false,
        });

        if (existingUser) {
            return new ErrorResponse(400, "You are already a participant");
        }

        const isLeavedUser = await EventItemModel.findOne({
            eventId: eventId,
            userId: userId,
            isLeave: true,
        });

        if (isLeavedUser) {
            const rejoinResult = await EventItemModel.updateOne(
                { userId: userId, eventId: eventId },
                { $set: { isLeave: false } }
            );
            return new SuccessResponse(
                rejoinResult,
                "You have rejoined the event",
                null
            );
        }

        const joinResult = await EventItemModel.create({
            eventId: eventId,
            userId: userId,
        });

        return new SuccessResponse(
            joinResult,
            "You have joined the event",
            null
        );
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const leaveEvent = async (eventId, userId) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });

        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        const isEventUser = await EventItemModel.findOne({
            eventId: eventId,
            userId: userId,
            isLeave: false,
        });

        if (!isEventUser) {
            return new ErrorResponse(401, "You do not have permission");
        }
        const leaveResult = await EventItemModel.updateOne(
            { userId: userId, eventId: eventId },
            { $set: { isLeave: true } }
        );

        return new SuccessResponse(
            leaveResult,
            "You have left the event",
            null
        );
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const getEventUsers = async (eventId) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });

        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        const eventUsers = await EventItemModel.find({
            eventId: eventId,
            isLeave: false,
        }).populate("userId", "name surname avatar");

        if (!eventUsers) {
            return new ErrorResponse(404, "No users found for this event");
        }

        const users = [];
        eventUsers.map((member) => {
            const userInfo = new ProfileInfoDto(
                member.userId._id,
                member.userId.name,
                member.userId.surname,
                member.userId.avatar
            );
            users.push(userInfo);
        });

        return new SuccessResponse(users, "Users found", users.length);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const getUserEvents = async (userId) => {
    try {
        const events = await EventItemModel.find({
            userId: userId,
            isLeave: false,
        }).populate("eventId", "title description startDate location");

        if (!events) {
            return new ErrorResponse(404, "No events found for this user");
        }

        const eventData = events.map((event) => {
            return new EventInfoDtos(
                event.eventId._id,
                event.eventId.title,
                event.eventId.description,
                event.eventId.startDate,
                event.eventId.location,
                event.isActive
            );
        });

        return new SuccessResponse(eventData, "Events found", eventData.length);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const getActiveEventByGroupId = async (groupId) => {
    try {
        const event = await EventModel.findOne({
            groupId: groupId,
            isActive: true,
        });

        if (!event) {
            return new ErrorResponse(
                404,
                "No active event found for this group"
            );
        }

        const eventData = new EventInfoDtos(
            event._id,
            event.title,
            event.description,
            event.startDate,
            event.location,
            event.isActive,
            event.difficulty,
            event.imageUrl
        );

        return new SuccessResponse(eventData, "Active event found");
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const removeUserFromEvent = async (eventId, targetUserId, adminId) => {
    try {
        const event = await EventModel.findById(eventId);
        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        const isAdmin = await GroupItemModel.findOne({
            groupId: event.groupId,
            userId: adminId,
            isAdmin: true,
        });

        if (!isAdmin) {
            return new ErrorResponse(401, "You do not have permission");
        }

        const target = await EventItemModel.findOne({
            eventId,
            userId: targetUserId,
            isLeave: false,
        });

        if (!target) {
            return new ErrorResponse(
                404,
                "User not found or already left the event"
            );
        }

        const update = await EventItemModel.updateOne(
            { eventId, userId: targetUserId },
            { $set: { isLeave: true } }
        );

        return new SuccessResponse(update, "User removed from event", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const getPastEvents = async (groupId) => {
    try {
        const events = await EventModel.find({
            groupId: groupId,
            isActive: false,
        });

        if (!events) {
            return new ErrorResponse(404, "No past events found");
        }

        const eventData = events.map((event) => {
            return new EventInfoDtos(
                event._id,
                event.title,
                event.description,
                event.startDate,
                event.location,
                event.isActive,
                event.difficulty,
                event.imageUrl
            );
        });

        return new SuccessResponse(
            eventData,
            "Past events found",
            eventData.length
        );
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const getEventUsersCount = async (eventId) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });

        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        const count = await EventItemModel.countDocuments({
            eventId: eventId,
            isLeave: false,
        });

        return new SuccessResponse(count, "User count retrieved", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const isUserInEvent = async (eventId, userId) => {
    try {
        const event = await EventItemModel.findOne({
            eventId: eventId,
            userId: userId,
            isLeave: false,
        });

        if (!event) {
            return new ErrorResponse(404, "User not found in this event");
        }
        return new SuccessResponse(true, "User is in the event", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const isAdmin = async (eventId, userId) => {
    try {
        const isAdmin = await EventItemModel.findOne({
            eventId: eventId,
            userId: userId,
            isAdmin: true,
        });
        if (isAdmin) {
            return new SuccessResponse(true, "User is an admin", null);
        }
        return new SuccessResponse(false, "User is not an admin", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

export default {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    getAllEvents,
    joinEvent,
    leaveEvent,
    getEventUsers,
    getUserEvents,
    getActiveEventByGroupId,
    removeUserFromEvent,
    getPastEvents,
    getEventUsersCount,
    isUserInEvent,
    isAdmin,
};
