import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";
import { useForm } from "../shared/hooks/form-hook";
import Input from "../shared/components/FormElements/Input";
import Button from "../shared/components/FormElements/Button";
import MessageList from "./MessageList";
import { VALIDATOR_REQUIRE } from "../shared/util/validators";

const Chat = () => {
  const eventId = useParams().eventId;
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedMessages, setLoadedMessages] = useState([]);

  const [formState, inputHandler] = useForm(
    {
      newMessage: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  const [ws, setWs] = useState(undefined);

  const connectWs = () => {
    const ws = new WebSocket(
      `ws://localhost:5000/api/chat/${eventId}?token=${auth.token}`
    );

    ws.onmessage = ({ data }) => {
      const newMessages = JSON.parse(data);

      setLoadedMessages((loadedMessages) => [
        ...loadedMessages,
        ...newMessages,
      ]);
    };

    ws.onclose = (event) => {
      setWs(undefined);
      connectWs();
    };

    ws.onerror = (event) => {
      // panic
    };

    setWs(ws);
  };

  useEffect(connectWs, []);

  const newMessageHandler = async (event) => {
    event.preventDefault();

    if (typeof ws === "undefined") {
      return;
    }

    const newMessage = JSON.stringify({
      event: eventId,
      author: auth.userId,
      text: formState.inputs.newMessage.value,
    });

    ws.send(newMessage);
  };

  return (
    <div>
      <h1>Chat</h1>
      {loadedMessages && <MessageList items={loadedMessages} />}
      <div>
        <form onSubmit={newMessageHandler}>
          <Input
            id="newMessage"
            element="input"
            type="text"
            label="Your Message"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            onSubmit={newMessageHandler}
          >
            Send
          </Button>
        </form>
        <br></br>
      </div>
    </div>
  );
};

export default Chat;
