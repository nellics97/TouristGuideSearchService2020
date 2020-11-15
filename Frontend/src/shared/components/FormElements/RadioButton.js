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
              onChange={this.onValueChange}
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
              onChange={this.onValueChange}
            />
            Tourist
          </label>
        </div>
        <div className="radio"></div>
        <div>Selected option is : {this.state.selectedOption}</div>
      </React.Fragment>
    );
  }
}

export default RadioButton;
