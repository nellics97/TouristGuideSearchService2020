//import TagPicker from "../shared/components/FormElements/TagPicker";
import React, { useState } from "react";
import { TagInput } from "reactjs-tag-input";

const Chat = ({ input }) => {
  const [tags, setTags] = useState([]);
  const onTagsChanged = (item) => {
    setTags(item);
    console.log(item);
    console.log(tags);
  };
  return <TagInput tags={tags} onTagsChanged={onTagsChanged} {...input} />;
};
export default Chat;
