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
  const history = useHistory();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/events/${eventId}`
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
        `http://localhost:5000/api/events/${eventId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(eventId);
    } catch (err) {}
    history.push("/");
  };

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
            {!isLoading && loadedEvent && (
              <React.Fragment>
                <h2>{loadedEvent.title}</h2>
                <h3>{loadedEvent.place}</h3>
                <h3>{loadedEvent.description}</h3>
                <h3>{loadedEvent.attendees}</h3>
                <h3>{loadedEvent.creator}</h3>
              </React.Fragment>
            )}
          </div>
          <div className="event-item__actions">
            {!isLoading &&
              loadedEvent &&
              auth.userId !== loadedEvent.creator && (
                <Button to={`/events/${eventId}`}>Apply</Button>
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
