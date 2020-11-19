import React, { useEffect, useState } from "react";

import EventList from "../components/EventList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import TagPicker from "../../shared/components/FormElements/TagPicker";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import DatePicker from "../../shared/components/FormElements/DatePicker";

const Events = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEvents, setLoadedEvents] = useState();
  const [showModal, setShowModal] = useState(false);
  const [tagsValue, setTagsValue] = useState([]);

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

  const tagsEventHandler = (data) => {
    let tagList = [];
    for (let i = 0; i < data.tags.length; i++) {
      tagList.push(data.tags[i].displayValue);
    }
    setTagsValue((tagsValue) => [...tagsValue, tagList]);
  };

  useEffect(() => {
    console.log(tagsValue);
  }, [tagsValue]);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const cancelReviewHandler = (e) => {
    console.log("cancel");
    e.key === "Enter" && e.preventDefault();
    setShowModal(false);
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
        <React.Fragment>
          <Button onClick={showModalHandler}>Filter Events</Button>
          <form
            onKeyPress={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
          >
            <Modal
              show={showModal}
              onCancel={cancelReviewHandler}
              header="Filter events"
              footerClass="event-item__modal-actions"
              footer={
                <React.Fragment>
                  <TagPicker id="tags" onChange={tagsEventHandler} />
                  <DatePicker id="date" className="center" />

                  <Button inverse onClick={cancelReviewHandler}>
                    Cancel
                  </Button>
                  <Button type="submit">Ok</Button>
                </React.Fragment>
              }
            ></Modal>
          </form>
          <EventList items={loadedEvents} onDeleteEvent={eventDeleteHandler} />)
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Events;
