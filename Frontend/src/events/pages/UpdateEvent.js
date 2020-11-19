import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import TagPicker from "../../shared/components/FormElements/TagPicker";
import RadioButton from "../../shared/components/FormElements/RadioButton";
import DatePicker from "../../shared/components/FormElements/DatePicker";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./EventForm.css";

const UpdateEvent = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEvent, setLoadedEvent] = useState();
  const auth = useContext(AuthContext);
  const eventId = useParams().eventId;
  const history = useHistory();

  const [guideValue, setGuideValue] = useState();
  const [dateValue, setDateValue] = useState();
  const [tagsValue, setTagsValue] = useState([]);

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
            guide: {
              value: responseData.event.guide,
              isValid: true,
            },
            title: {
              value: responseData.event.title,
              isValid: true,
            },
            tags: {
              value: responseData.event.tags,
              isValid: true,
            },
            place: {
              value: responseData.event.place,
              isValid: true,
            },
            date: {
              value: responseData.event.date,
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
          guide: guideValue,
          title: formState.inputs.title.value,
          tags: tagsValue[tagsValue.length - 1],
          place: formState.inputs.place.value,
          date: dateValue,
          description: formState.inputs.description.value,
          attendees: formState.inputs.attendees.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(sendRequest);
      history.push("/"); //majd az event oldalara iranyitsd
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
    setDateValue(data.selectedDay.toLocaleDateString());
  };

  const tagsEventHandler = (data) => {
    let tagList = [];
    for (let i = 0; i < data.tags.length; i++) {
      tagList.push(data.tags[i].displayValue);
    }
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
  }, [tagsValue]);

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
        <form
          className="event-form"
          onSubmit={eventUpdateSubmitHandler}
          onKeyPress={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
        >
          <RadioButton id="guide" onChange={radioButtonEventhandler} />
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
          <h4>You can change tags</h4>
          <br></br>
          <TagPicker id="tags" onChange={tagsEventHandler} />
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
          <h4>Date</h4>
          <DatePicker
            id="date"
            onChange={datePickerEventHandler}
            validators={[VALIDATOR_REQUIRE()]}
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
