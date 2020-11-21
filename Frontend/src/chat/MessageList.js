import React from "react";

import Card from "../shared/components/UIElements/Card";
import MessageItem from "./MessageItem";

const MessageList = (props) => {
  if (props.items.length === 0) {
    return (
      <div>
        <Card>
          <h2>No messages yet</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul>
      {props.items.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          event={message.event}
          author={message.author}
          text={message.text}
          time={message.time}
        />
      ))}
    </ul>
  );
};

export default MessageList;
