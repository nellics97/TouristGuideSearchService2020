const Message = require("../models/message");
const HttpError = require("../models/http-error");

const getMessagesByEventId = async (req, res, next) => {
  const eventId = req.params.eid;
  console.log(eventId);
  let message;
  try {
    message = await Message.find({ event: eventId });
    console.log(message);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not any messages.",
      500
    );
    return next(error);
  }

  if (!message) {
    const error = new HttpError(
      "Could not find messages for the provided event.",
      404
    );
    return next(error);
  }

  res.json({
    messages: message.map((msg) => msg.toObject({ getters: true })),
  });
};

const sendMessage = async (req, res, next) => {
  const { event, author, text, time } = req.body;
  const createdMessage = new Message({
    event,
    author,
    text,
    time,
  });

  if (author.toString() === req.userData.userId) {
    try {
      await createdMessage.save();
    } catch (err) {
      const error = new HttpError(
        "Creating event failed, please try again.",
        500
      );
      return next(error);
    }
  } else {
    const error = new HttpError(
      "You can't write messages as other users!",
      403
    );
    return next(error);
  }

  res.status(201).json({ message: createdMessage });
};

exports.getMessagesByEventId = getMessagesByEventId;
exports.sendMessage = sendMessage;
