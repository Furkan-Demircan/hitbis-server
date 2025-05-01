import { ErrorResponse } from "../helpers/responseHelper.js";
import eventService from "../services/eventService.js";

const createEvent = async (req, res) => {
    const groupId = req.query.groupId;
    const adminId = req.user.userId;
    const eventData = req.body;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await eventService.createEvent(groupId, adminId, eventData);
    return res.json(result);
};

const getEventById = async (req, res) => {
    const eventId = req.query.eventId;

    if (!eventId) {
        return res.json(new ErrorResponse(404, "Event not found"));
    }

    var result = await eventService.getEventById(eventId);
    return res.json(result);
};

const updateEvent = async (req, res) => {
    const data = req.body;
    const eventId = req.query.eventId;
    const userId = req.user.userId;

    if (!eventId) {
        return res.json(new ErrorResponse(404, "Event not found"));
    }

    var result = await eventService.updateEvent(eventId, userId, data);
    return res.json(result);
};

const deleteEvent = async (req, res) => {
    const eventId = req.query.eventId;
    const userId = req.user.userId;

    if (!eventId) {
        return res.json(new ErrorResponse(404, "Event not found"));
    }

    var result = await eventService.deleteEvent(eventId, userId);
    return res.json(result);
};

const getAllEvents = async (req, res) => {
    const groupId = req.query.groupId;

    var result = await eventService.getAllEvents(groupId);
    return res.json(result);
};

const joinEvent = async (req, res) => {
    const eventId = req.query.eventId;
    const userId = req.user.userId;

    if (!eventId) {
        return res.json(new ErrorResponse(404, "Event not found"));
    }

    var result = await eventService.joinEvent(eventId, userId);
    return res.json(result);
};

const leaveEvent = async (req, res) => {
    const eventId = req.query.eventId;
    const userId = req.user.userId;

    if (!eventId) {
        return res.json(new ErrorResponse(404, "Event not found"));
    }

    var result = await eventService.leaveEvent(eventId, userId);
    return res.json(result);
};

const getEventUsers = async (req, res) => {
    const eventId = req.query.eventId;

    if (!eventId) {
        return res.json(new ErrorResponse(404, "Event not found"));
    }

    var result = await eventService.getEventUsers(eventId);
    return res.json(result);
};

const getUserEvents = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User not found"));
    }

    var result = await eventService.getUserEvents(userId);
    return res.json(result);
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
};
