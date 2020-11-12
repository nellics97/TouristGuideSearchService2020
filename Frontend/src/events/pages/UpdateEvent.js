import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./EventForm.css";

const UpdateEvent = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEvent, setLoadedEvent] = useState();

  const eventId = useParams().eventId;
  const history = useHistory();
  console.log(eventId);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      place: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      attendees: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/events/${eventId}`
        );
        setLoadedEvent(responseData.event);
        setFormData(
          {
            title: {
              value: responseData.event.title,
              isValid: true,
            },
            place: {
              value: responseData.event.place,
              isValid: true,
            },
            description: {
              value: responseData.event.description,
              isValid: true,
            },
            attendees: {
              value: responseData.event.attendees,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchEvent();
  }, [sendRequest, eventId, setFormData]);

  const eventUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/events/${eventId}/update`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          place: formState.inputs.place.value,
          description: formState.inputs.description.value,
          attendees: formState.inputs.attendees.value,
        }),
        { "Content-Type": "application/json" }
      );
      console.log(sendRequest);
      history.push("/"); //majd az event oldalara iranyitsd
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedEvent && !error) {
    return (
      <div className="center">
        <Card>
          <h2>No event found</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedEvent && (
        <form className="event-form" onSubmit={eventUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            error="enter valid title"
            onInput={inputHandler}
            value={loadedEvent.title}
            valid={true}
          />
          <Input
            id="place"
            element="input"
            type="text"
            label="Place"
            validators={[VALIDATOR_REQUIRE()]}
            error="enter valid place"
            onInput={inputHandler}
            value={loadedEvent.place}
            valid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            error="enter valid description"
            onInput={inputHandler}
            value={loadedEvent.description}
            valid={true}
          />
          <Input
            id="attendees"
            element="input"
            type="number"
            label="Attendees"
            validators={[VALIDATOR_REQUIRE()]}
            error="enter valid number"
            onInput={inputHandler}
            value={loadedEvent.attendees}
            valid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Event
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateEvent;
