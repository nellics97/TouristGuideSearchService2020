import React from "react";

import Card from "../../shared/components/UIElements/Card";
import "./EventItem.css";

const EventItem = (props) => {
  return (
    <li className="event-item">
      <Card className="event-item__content">
        <div className="event-item__info">
          <h2>{props.title}</h2>
          <h3>{props.place}</h3>
          <h3>{props.description}</h3>
          <h3>{props.attendees}</h3>
          <h3>{props.creator}</h3>
        </div>
        <div className="event-item__actions">
          <button>Apply</button>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </Card>
    </li>
  );
};

export default EventItem;
