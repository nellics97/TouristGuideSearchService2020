const uuid = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Event = require("../models/event");
const User = require("../models/user");
const { create } = require("../models/user");
const user = require("../models/user");

const getEvents = async (req, res, next) => {
  let events;
  try {
    events = await Event.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching events failed, please try again later. itt romlott el",
      500
    );
    return next(error);
  }
  res.json({
    events: events.map((event) => event.toObject({ getters: true })),
  });
};

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

  res.json({ event: event.toObject({ getters: true }) });
};

const getEventsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithEvents;
  try {
    userWithEvents = await User.findById(userId).populate("events");
  } catch (err) {
    const error = new HttpError(
      "Fetching events failed, please try again later",
      500
    );
    return next(error);
  }

  if (!userWithEvents || userWithEvents.events.length === 0) {
    return next(
      new HttpError("Could not find events for the provided user id.", 404)
    );
  }

  res.json({
    events: userWithEvents.events.map((event) =>
      event.toObject({ getters: true })
    ),
  });
};

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);
  //if (!errors.isEmpty()) {
  //  return next(
  //    new HttpError("Invalid inputs passed, please check your data.1", 422)
  //  );
  //}

  const { title, place, description, attendees, creator } = req.body;
  console.log(req.title);
  const createdEvent = new Event({
    title,
    place,
    description,
    attendees,
    creator: req.userData.userId,
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
    const error = new HttpError("Couldn't find user for provided id1", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdEvent.save({ session: sess });
    user.events.push(createdEvent);
    await user.save({ session: sess });
    await sess.commitTransaction();
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
      new HttpError("Invalid inputs passed, please check your data.2", 422)
    );
  }

  const { title, place, description, attendees, creator } = req.body;
  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update event.1  " + eventId,
      500
    );
    return next(error);
  }

  if (event.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You really shouldn't edit other users' events!",
      403
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
      "Something went wrong, could not update event.2",
      500
    );
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

const addNewAttendee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { attendees, creator, participant } = req.body;
  const eventId = req.params.eid;
  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update event.1  " + eventId,
      500
    );
    return next(error);
  }

  if (
    event.attendees > event.participant.length + 1 &&
    event.participant.indexOf(participant.toString()) === -1
  ) {
    event.participant.push(participant);
  } else {
    const error = new HttpError("You cant apply!", 403);
    return next(error);
  }

  //event.attendees > event.participant.length + 1 &&
  //event.participant.indexOf(participant.toString()) === -1
  //  ? event.participant.push(participant)
  //  : console.log("Cannot apply");
  //console.log(event.attendees);
  //console.log(event.participant);
  //console.log(participant);
  //console.log(event.participant.length);

  try {
    await event.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update event.2",
      500
    );
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

const getAttendeesById = async (req, res, next) => {
  const eventId = req.params.eid;

  let attendingUser;
  try {
    attendingUser = await Event.findById(eventId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!attendingUser) {
    const error = new HttpError(
      "Could not find user for the provided id. ",
      404
    );
    return next(error);
  }

  res.json({ attendingUser: attendingUser.toObject({ getters: true }) });
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete event. >:(",
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError("Couldn't find event for this id", 404);
    return next(error);
  }

  if (event.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You really shouldn't delete other users' events",
      403
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await event.remove({ session: sess });
    event.creator.events.pull(event);
    await event.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete event. :(",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted event." });
};

exports.getEvents = getEvents;
exports.getEventById = getEventById;
exports.getEventsByUserId = getEventsByUserId;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.addNewAttendee = addNewAttendee;
exports.getAttendeesById = getAttendeesById;
exports.deleteEvent = deleteEvent;
