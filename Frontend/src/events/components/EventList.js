import React from "react";

import Card from "../../shared/components/UIElements/Card";
import EventItem from "./EventItem";
import "./EventList.css";

const EventList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="event_list center">
        <Card>
          <h2>No events found</h2>
          <button>Share Event</button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="event-list">
      {props.items.map((event) => (
        <EventItem
          key={event.id}
          id={event.id}
          title={event.title}
          place={event.place}
          description={event.description}
          attendees={event.attendees}
          creator={event.creator}
        />
      ))}
    </ul>
  );
};

export default EventList;
