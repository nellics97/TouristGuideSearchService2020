import React, { useEffect, useState } from "react";

import EventList from "../components/EventList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import TagPicker from "../../shared/components/FormElements/TagPicker";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import MultipleDaysPicker from "../../shared/components/FormElements/MultipleDaysPicker";
import RadioButton from "../../shared/components/FormElements/RadioButton";
import "./Events.css";

const Events = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEvents, setLoadedEvents] = useState();
  const [showModal, setShowModal] = useState(false);
  const [guideValue, setGuideValue] = useState();
  const [tagsValue, setTagsValue] = useState([]);
  const [datesValue, setDatesValue] = useState([]);
  const [isFiltered, setFiltered] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState();

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

  const eventFilterHandler = async (event) => {
    event.preventDefault();
    setShowModal(false);
    const fetchFilteredEvents = async () => {
      if (!isLoading && loadedEvents) {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/events/filter`,
            "POST",
            JSON.stringify({
              guide: guideValue,
              tags: tagsValue[tagsValue.length - 1],
              dates: datesValue[datesValue.length - 1],
            }),
            {
              "Content-Type": "application/json",
            }
          );
          setFilteredEvents(responseData.events);
          setFiltered(true);
          //window.location.reload();
        } catch (err) {}
      }
    };
    fetchFilteredEvents();
  };

  const radioButtonEventhandler = (data) => {
    if (data.selectedOption === "TouristGuide") {
      setGuideValue(true);
    } else {
      setGuideValue(false);
    }
  };

  const tagsEventHandler = (data) => {
    let tagList = [];
    for (let i = 0; i < data.tags.length; i++) {
      tagList.push(data.tags[i].displayValue);
    }
    setTagsValue((tagsValue) => [...tagsValue, tagList]);
  };

  const datePickerEventHandler = (data) => {
    let daysList = [];
    console.log(data.selectedDays);
    for (let i = 0; i < data.selectedDays.length; i++) {
      daysList.push(new Date(data.selectedDays[i]).toLocaleDateString());
    }
    setDatesValue((datesValue) => [...datesValue, daysList]);
  };

  useEffect(() => {
    console.log(guideValue);
  }, [guideValue]);

  useEffect(() => {
    console.log(tagsValue);
  }, [tagsValue]);

  useEffect(() => {
    console.log(datesValue);
  }, [datesValue]);

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
          <div className="centered-button-container">
            <Button onClick={showModalHandler}>Filter Events</Button>
          </div>
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
                  <RadioButton id="guide" onChange={radioButtonEventhandler} />
                  <MultipleDaysPicker
                    id="date"
                    onChange={datePickerEventHandler}
                  />
                  <Button inverse onClick={cancelReviewHandler}>
                    Cancel
                  </Button>
                  <Button
                    onClick={eventFilterHandler}
                    onSubmit={eventFilterHandler}
                    type="submit"
                  >
                    Ok
                  </Button>
                </React.Fragment>
              }
            ></Modal>
          </form>
          {!isFiltered && (
            <EventList
              items={loadedEvents}
              onDeleteEvent={eventDeleteHandler}
            />
          )}
          {isFiltered && (
            <EventList
              items={filteredEvents}
              onDeleteEvent={eventDeleteHandler}
            />
          )}
          )
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Events;
