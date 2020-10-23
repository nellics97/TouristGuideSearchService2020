import React from "react";

import EventList from "../components/EventList";

const DUMMY_EVENTS = [
  {
    id: "e1",
    title: "bulika",
    place: "bucinál",
    description: "házavató",
    attendees: "4",
    creator: "u1",
  },
  {
    id: "e2",
    title: "kocsmázás",
    place: "paranoir",
    description: "halloween",
    attendees: "7",
    creator: "u1",
  },
];

const Events = () => {
  return <EventList items={DUMMY_EVENTS} />;
};

export default Events;
