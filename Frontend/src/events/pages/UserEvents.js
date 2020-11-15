import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EventList from "../components/EventList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserEvents = () => {
  const [loadedEvents, setLoadedEvents] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/events/user/${userId}`
        );
        setLoadedEvents(responseData.events);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const EventDeletedHandler = (deletedEventId) => {
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
        <EventList items={loadedEvents} onDeleteEvent={EventDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserEvents;
