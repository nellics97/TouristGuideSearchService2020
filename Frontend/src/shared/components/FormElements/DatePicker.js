import React from "react";
import DayPicker from "react-day-picker";

import "react-day-picker/lib/style.css";

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedDay: undefined,
    };
  }

  handleDayClick(day) {
    this.setState({ selectedDay: day });
    console.log(day.toLocaleDateString());
    //this.props.parentCallback(day.toLocaleDateString());
  }

  handleChange = (event) => {
    this.setState({ selectedDay: event }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  };

  render() {
    return (
      <div>
        <DayPicker
          onDayClick={this.handleChange}
          selectedDays={this.state.selectedDay}
          onChange={this.handleChange}
          disabledDays={{ before: new Date() }}
        />
      </div>
    );
  }
}
