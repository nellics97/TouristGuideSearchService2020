import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
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
          <Button>Apply</Button>
          <Button to={`/events/${props.id}`}>Edit</Button>
          <Button danger>Delete</Button>
        </div>
      </Card>
    </li>
  );
};

export default EventItem;