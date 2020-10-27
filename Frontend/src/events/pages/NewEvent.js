import React from "react";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import "./EventForm.css";

const NewEvent = () => {
  const [formState, inputHandler] = useForm(
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

  const eventCreatorHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); //todo send backend
  };

  return (
    <form className="event-form" onSubmit={eventCreatorHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter valid title"
        onInput={inputHandler}
      />
      <Input
        id="place"
        element="input"
        type="text"
        label="Place"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter valid place"
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter valid description"
        onInput={inputHandler}
      />
      <Input
        id="attendees"
        element="input"
        type="number"
        label="Attendees"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter valid number"
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Create event
      </Button>
    </form>
  );
};

export default NewEvent;
