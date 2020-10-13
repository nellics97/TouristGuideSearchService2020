const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Event = require("../models/event");
const User = require("../models/user");
const { create } = require("../models/user");

const getEventById = async (req, res, next) => {
  const eventId = req.params.eid; // { eid: 'e1' }

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find event.",
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError(
      "Could not find event for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place: event.toObject({ getters: true }) });
};

const getEventsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let events;
  try {
    events = await Event.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching events failed, please try again later",
      500
    );
    return next(error);
  }

  if (!events || events.length === 0) {
    return next(
      new HttpError("Could not find events for the provided user id.", 404)
    );
  }

  res.json({
    events: events.map((event) => event.toObject({ getters: true })),
  });
};

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, place, description, attendees } = req.body;

  // const title = req.body.title;
  const createdEvent = new Event({
    title,
    place,
    description,
    attendees,
    creator,
    attendingUsers: [],
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating event failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Couldn't find user for provided id", 404);
    return next(error);
  }

  try {
    await createdEvent.save();
  } catch (err) {
    const error = new HttpError(
      "Creating event failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, place, description, attendees } = req.body;
  const eventId = req.params.eid;

  let event;
  try {
    event = await EventfindById(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update event.",
      500
    );
    return next(error);
  }

  event.title = title;
  event.description = description;
  event.place = place;
  event.attendees = attendees;

  try {
    await event.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update event.",
      500
    );
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete event.",
      500
    );
    return next(error);
  }

  try {
    await event.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted event." });
};

exports.getEventById = getEventById;
exports.getEventsByUserId = getEventsByUserId;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
