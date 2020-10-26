import React, { useCallback, useReducer } from "react";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./NewEvent.css";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    default:
      return state;
  }
};

const NewEvent = () => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    isValid: false,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

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
