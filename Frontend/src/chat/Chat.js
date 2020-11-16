import React from "react";
import TagPicker from "../shared/components/FormElements/TagPicker";

const Chat = () => {
  const eventhandler = (data) => {
    console.log("fasz");
    console.log(data);
  };

  return <TagPicker onChange={eventhandler} />;
};
export default Chat;
