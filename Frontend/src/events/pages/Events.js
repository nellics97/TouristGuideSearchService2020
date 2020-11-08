import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EventList from "../components/EventList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Events = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEvents, setLoadedEvents] = useState();

  const userId = useParams().userId; //mi a faszert undefined??

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/events"
        );
        setLoadedEvents(responseData.events);
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest]);

  const eventDeleteHandler = (deletedEventId) => {
    setLoadedEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== deletedEventId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedEvents && (
        <EventList items={loadedEvents} onDeleteEvent={eventDeleteHandler} />
      )}
    </React.Fragment>
  );
};

export default Events;
