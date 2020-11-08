import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./EventItem.css";

const EventItem = (props) => {
  const auth = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleleteHandler = () => {
    setShowConfirmModal(false);
    console.log("DELETING for now");
  };

  return (
    <React.Fragment>
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
          <div className="event-item__info">
            <h2>{props.title}</h2>
            <h3>{props.place}</h3>
            <h3>{props.description}</h3>
            <h3>{props.attendees}</h3>
            <h3>{props.creator}</h3>
          </div>
          <div className="event-item__actions">
            {auth.isLoggedIn && <Button to={`/chat/${props.id}`}>Apply</Button>}
            {auth.isLoggedIn && (
              <Button to={`/events/${props.id}`}>Edit</Button>
            )}
            {auth.isLoggedIn && (
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

export default EventItem;
