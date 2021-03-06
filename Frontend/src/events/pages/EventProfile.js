import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./EventProfile.css";

const EventProfile = (props) => {
  const eventId = useParams().eventId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadedEvent, setLoadedEvent] = useState();
  const [loadedUser, setLoadedUser] = useState();
  const history = useHistory();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/events/${eventId}`
        );
        setLoadedEvent(responseData.event);
      } catch (err) {}
    };
    fetchEvent();
  }, [sendRequest, eventId]);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/events/${eventId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(eventId);
    } catch (err) {}
    history.push("/");
  };

  const ManageAttendeesHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/events/${eventId}/addattendee`,
        "PATCH",
        JSON.stringify({
          participant: auth.userId,
          auth_email: loadedUser.email,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(loadedUser.email);
      history.push(`/chat/${eventId}`);
    } catch (err) {}
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${loadedEvent.creator}`
        );
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUserData();
  }, [sendRequest, loadedEvent]);

  let lookingFor = "";
  if (!isLoading && loadedEvent && loadedEvent.guide) {
    lookingFor = "tourist";
  } else {
    lookingFor = "tourist guide";
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Deletion warning"
        footerClass="event-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleleteHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you really want do delete this event?</p>
      </Modal>
      <li className="event-item">
        <Card className="event-item__content">
          {isLoading && <LoadingSpinner asOverLay />}
          <div className="event-item__info">
            {!isLoading && loadedEvent && loadedUser && (
              <React.Fragment>
                <h2>{loadedEvent.title}</h2>
                <h3>Looking for a {lookingFor}</h3>
                <h3>tags: {loadedEvent.tags}</h3>
                <h3>place: {loadedEvent.place}</h3>
                <h3>date: {loadedEvent.date}</h3>
                <h3>description:</h3>
                <p>{loadedEvent.description}</p>
                <h3>number of attendees: {loadedEvent.attendees}</h3>
                <h3>creator: {loadedUser.name}</h3>
              </React.Fragment>
            )}
          </div>
          <div className="event-item__actions">
            {!isLoading &&
              loadedEvent &&
              auth.userId !== loadedEvent.creator &&
              !loadedEvent.participant.includes(auth.userId) && (
                <Button onClick={ManageAttendeesHandler}>Apply</Button>
              )}
            {!isLoading &&
              loadedEvent &&
              (loadedEvent.participant.includes(auth.userId) ||
                auth.userId === loadedEvent.creator) && (
                <Button to={`/chat/${eventId}`}>Chat</Button>
              )}
            {!isLoading &&
              loadedEvent &&
              auth.userId === loadedEvent.creator && (
                <Button to={`/events/${eventId}/update`}>Edit</Button>
              )}
            {!isLoading && loadedEvent && auth.userId === loadedEvent.creator && (
              <Button danger onClick={showDeleteWarningHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default EventProfile;
