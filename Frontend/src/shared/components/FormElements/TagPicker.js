import React, { useState } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

const TagPicker = () => {
  const [tags, setTags] = useState([]);
  return <ReactTagInput tags={tags} onChange={(newTags) => setTags(newTags)} />;
};

export default TagPicker;
