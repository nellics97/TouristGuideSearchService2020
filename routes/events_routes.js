const express = require("express");
const { check } = require("express-validator");

const eventsControllers = require("../controllers/events_controllers");

const router = express.Router();

router.get("/:eid", eventsControllers.getEventById);

router.get("/user/:uid", eventsControllers.getEventsByUserId);

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
  "/:eid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  eventsControllers.updateEvent
);

router.delete("/:eid", eventsControllers.deleteEvent);

module.exports = router;
