const express = require("express");
const { check } = require("express-validator");

const eventsControllers = require("../controllers/events_controllers");

const router = express.Router();

router.get("/", eventsControllers.getEvents);

router.get("/:eid", eventsControllers.getEventById);

router.get("/:uid", eventsControllers.getEventsByUserId);

router.get("/:eid/users", eventsControllers.getAttendeesById);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("place").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("attendees").not().isEmpty(),
  ],
  eventsControllers.createEvent
);

router.patch(
  "/:eid/update",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  eventsControllers.updateEvent
);

router.patch("/:eid/addattendee", eventsControllers.addNewAttendee); //na ez nem igy lesz am :D

router.delete("/:eid", eventsControllers.deleteEvent);

module.exports = router;
