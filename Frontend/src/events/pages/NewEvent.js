import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import "@pathofdev/react-tag-input/build/index.css";
import TagPicker from "../../shared/components/FormElements/TagPicker";
import "react-day-picker/lib/style.css";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "../../shared/components/FormElements/Button.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./EventForm.css";
import RadioButton from "../../shared/components/FormElements/RadioButton";
import DatePicker from "../../shared/components/FormElements/DatePicker";

const NewEvent = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
  const history = useHistory();

  const eventCreatorHandler = async (event) => {
    event.preventDefault();

    try {
      //const formData = new FormData();
      //formData.append("title", formState.inputs.title.value);
      //formData.append("place", formState.inputs.place.value);
      //formData.append("description", formState.inputs.description.value);
      //formData.append("attendees", formState.inputs.attendees.value);
      //formData.append("creator", auth.userId);
      console.log(formState.inputs.title.value);
      await sendRequest(
        "http://localhost:5000/api/events",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          place: formState.inputs.place.value,
          description: formState.inputs.description.value,
          attendees: formState.inputs.attendees.value,
          creator: auth.userId,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="event-form" onSubmit={eventCreatorHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <RadioButton />
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
        <h4>Date</h4>
        <DatePicker />

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
        <h4>You can add tags</h4>
        <TagPicker />
        <br></br>
        <Button type="submit" disabled={!formState.isValid}>
          Create event
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewEvent;
