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

// TODO: do shit properly -------------------------

const { EventEmitter } = require("events");

class MessageEmitter extends EventEmitter {}

class MessageEvents {
  static emitter = new MessageEmitter();
  static async addMessage(eventId, message) {
    const createdMessage = new Message({
      event: eventId,
      author: message.author,
      text: message.text,
      time: message.time,
    });

    try {
      message = messageToObject(await createdMessage.save());
    } catch (e) {
      // TODO
      console.error(e);
      return;
    }

    MessageEvents.emitter.emit(`message:${eventId}`, message);
  }
}

function messageToObject(msg) {
  msg = msg.toObject({ getters: true });

  console.log(msg);

  return {
    id: msg.id,
    author: msg.author,
    text: msg.text,
    time: msg.time,
  };
}

// -------------------------------------------------

exports.handleChatWs = async (socket, req) => {
  const eventId = req.params.eid;
  const userId = req.userData.userId;

  try {
    const messages = (
      await require("../models/message").find({ event: eventId })
    ).map(messageToObject);

    socket.send(JSON.stringify(messages));
  } catch (e) {
    socket.close();
  }

  socket.on("message", function (msg) {
    try {
      msg = JSON.parse(msg);
      MessageEvents.addMessage(eventId, {
        ...msg,
        author: userId,
        time: new Date(),
      });
    } catch (e) {
      console.error(e);
      socket.close();
    }
  });

  const listener = (message) => {
    socket.send(JSON.stringify([message]));
  };

  MessageEvents.emitter.on(`message:${eventId}`, listener);

  socket.on("close", () => {
    MessageEvents.emitter.off(`message:${eventId}`, listener);
  });

  socket.on("error", (e) => {
    log.error(e);
    MessageEvents.emitter.off(`message:${eventId}`, listener);
  });
};

exports.getMessagesByEventId = getMessagesByEventId;
exports.sendMessage = sendMessage;
