import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./EventForm.css";

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

const UpdateEvent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const eventId = useParams().eventId;

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

  const identifiedEvent = DUMMY_EVENTS.find((e) => e.id === eventId);

  useEffect(() => {
    if (identifiedEvent) {
      setFormData(
        {
          title: {
            value: identifiedEvent.title,
            isValid: true,
          },
          place: {
            value: identifiedEvent.place,
            isValid: true,
          },
          description: {
            value: identifiedEvent.description,
            isValid: true,
          },
          attendees: {
            value: identifiedEvent.attendees,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedEvent]);

  const eventUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedEvent) {
    return (
      <div className="center">
        <Card>
          <h2>No event found</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="event-form" onSubmit={eventUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        error="enter valid title"
        onInput={inputHandler}
        value={formState.inputs.title.value}
        valid={formState.inputs.title.isValid}
      />
      <Input
        id="place"
        element="input"
        type="text"
        label="Place"
        validators={[VALIDATOR_REQUIRE()]}
        error="enter valid place"
        onInput={inputHandler}
        value={formState.inputs.place.value}
        valid={formState.inputs.place.isValid}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        error="enter valid description"
        onInput={inputHandler}
        value={formState.inputs.description.value}
        valid={formState.inputs.description.isValid}
      />
      <Input
        id="attendees"
        element="input"
        type="number"
        label="Attendees"
        validators={[VALIDATOR_REQUIRE()]}
        error="enter valid number"
        onInput={inputHandler}
        value={formState.inputs.attendees.value}
        valid={formState.inputs.attendees.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Update Event
      </Button>
    </form>
  );
};

export default UpdateEvent;
