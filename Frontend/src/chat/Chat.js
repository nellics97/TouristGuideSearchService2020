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
  const [loadedMessages, setLoadedMessages] = useState();

  const [formState, inputHandler] = useForm(
    {
      newMessage: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/chat/${eventId}`
        );
        setLoadedMessages(responseData.messages);
      } catch (err) {}
    };
    fetchMessages();
  }, [sendRequest, eventId]);

  const newMessageHandler = async (event) => {
    event.preventDefault();
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    try {
      await sendRequest(
        `http://localhost:5000/api/chat/${eventId}`,
        "POST",
        JSON.stringify({
          event: eventId,
          author: auth.userId,
          text: formState.inputs.newMessage.value,
          time: dateTime,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
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
