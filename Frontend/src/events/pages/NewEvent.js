import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "@pathofdev/react-tag-input/build/index.css";
import TagPicker from "../../shared/components/FormElements/TagPicker";
import "react-day-picker/lib/style.css";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_UNDEFINED,
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

  const [guideValue, setGuideValue] = useState();
  const [dateValue, setDateValue] = useState();
  const [tagsValue, setTagsValue] = useState([]);

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
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/events",
        "POST",
        JSON.stringify({
          guide: guideValue,
          title: formState.inputs.title.value,
          tags: tagsValue[tagsValue.length - 1],
          place: formState.inputs.place.value,
          date: dateValue,
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

  const radioButtonEventhandler = (data) => {
    if (data.selectedOption === "TouristGuide") {
      setGuideValue(true);
    } else {
      setGuideValue(false);
    }
  };

  const datePickerEventHandler = (data) => {
    setDateValue(new Date(data.selectedDay).toLocaleDateString());
  };

  const tagsEventHandler = (data) => {
    let tagList = [];
    for (let i = 0; i < data.tags.length; i++) {
      tagList.push(data.tags[i].displayValue);
    }
    console.log(tagList);
    //setTagsValue((tagsValue) =>
    //  tagsValue.concat(data.tags[data.tags.length - 1].displayValue)
    //);
    setTagsValue((tagsValue) => [...tagsValue, tagList]);
  };

  useEffect(() => {
    console.log(guideValue);
  }, [guideValue]);

  useEffect(() => {
    console.log(dateValue);
  }, [dateValue]);

  useEffect(() => {
    console.log(tagsValue);
    console.log(tagsValue.length);
  }, [tagsValue]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form
        className="event-form"
        onSubmit={eventCreatorHandler}
        onKeyPress={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <RadioButton
          id="guide"
          onChange={radioButtonEventhandler}
          validators={[VALIDATOR_UNDEFINED(guideValue)]}
        />
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter valid title"
          onInput={inputHandler}
        />
        <h4>You can add tags</h4>
        <br></br>
        <TagPicker id="tags" onChange={tagsEventHandler} />
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
        <DatePicker
          id="date"
          onChange={datePickerEventHandler}
          validators={[VALIDATOR_REQUIRE()]}
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
        <br></br>
        <Button type="submit" disabled={!formState.isValid}>
          Create event
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewEvent;
