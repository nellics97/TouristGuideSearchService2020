import React, { Component } from "react";

class RadioButton extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value,
    });
  }

  formSubmit(event) {
    event.preventDefault();
    console.log(this.state.selectedOption);
  }

  handleChange = (event) => {
    this.setState({ selectedOption: event.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <h4>What are you?</h4>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="TouristGuide"
              checked={this.state.selectedOption === "TouristGuide"}
              onChange={this.handleChange}
            />
            TouristGuide
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="Tourist"
              checked={this.state.selectedOption === "Tourist"}
              onChange={this.handleChange}
            />
            Tourist
          </label>
        </div>
      </React.Fragment>
    );
  }
}

export default RadioButton;
