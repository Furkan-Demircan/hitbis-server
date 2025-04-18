import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import GroupModel from "../models/GroupModel.js";
import GroupItemModel from "../models/GroupItemModel.js";
import EventModel from "../models/EventModel.js";
import { EventInfoDtos } from "../dto/eventDtos.js";
import EventItemModel from "../models/EventItemModel.js";

const createEvent = async (groupId, adminId, eventData) => {
    try {
        const group = await GroupModel.findOne({ _id: groupId });
        const existingAdmin = await GroupItemModel.findOne({
            groupId: groupId,
            userId: adminId,
            isAdmin: true,
        });
        const existingEvent = await EventModel.findOne({
            groupId: groupId,
            isActive: true,
        });

        if (!group) {
            return new ErrorResponse(404, "Group not found");
        }

        if (!existingAdmin) {
            return new ErrorResponse(401, "You do not have permission");
        }

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
            event.isActive
        );

        return new SuccessResponse(eventData, "Event found", null);
    } catch (error) {
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
                event.isActive
            );
        });

        return new SuccessResponse(eventData, "Events found", eventData.length);
    } catch (error) {
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

        const updateResult = await EventModel.updateOne(
            { _id: eventId },
            { $set: data }
        );

        return new SuccessResponse(updateResult, "Event updated", null);
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
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const joinEvent = async (eventId, userId) => {
    try {
        const event = await EventModel.findOne({ _id: eventId });
        const isGroupUser = await GroupItemModel.findOne({
            groupId: event.groupId,
            userId: userId,
        });
        const existingUser = await EventItemModel.findOne({
            eventId: eventId,
            userId: userId,
        });

        if (!event) {
            return new ErrorResponse(404, "Event not found");
        }

        if (!isGroupUser) {
            return new ErrorResponse(401, "You do not have permission");
        }

        if (existingUser) {
            return new ErrorResponse(400, "You are already a participant");
        }

        const joinResult = await EventItemModel.create({
            eventId: eventId,
            userId: userId,
        });
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
};
