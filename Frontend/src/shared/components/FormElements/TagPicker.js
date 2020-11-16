import React from "react";

import { TagInput } from "reactjs-tag-input";

class TagPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: [] };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (tags) => {
    this.setState(tags, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  };

  onTagsChanged(tags) {
    this.setState({ tags });
    console.log(tags);
  }

  render() {
    return (
      <div>
        <TagInput
          placeholder="your tags"
          wrapperStyle={`
            position: relative;
                hwidth: 1.2rem`}
          tagStyle={`background: white;
                      color: #800020;`}
          tags={this.state.tags}
          onTagsChanged={this.handleChange}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
export default TagPicker;
