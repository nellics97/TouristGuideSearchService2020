import React, { useContext, useState, useEffect } from "react";

import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "../../events/components/EventItem.css";

const EventItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadedAuthor, setLoadedAuthor] = useState();
  const { isLoading, sendRequest } = useHttpClient();
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleleteHandler = async () => {
    setShowConfirmModal(false);
    console.log(props.text);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/reviews/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${props.author}`
        );
        setLoadedAuthor(responseData.user);
      } catch (err) {}
    };
    fetchUserData();
  }, [sendRequest, props]);

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
          {isLoading && <LoadingSpinner asOverLay />}
          <div className="event-item__info">
            {loadedAuthor && <h3>{loadedAuthor.name}</h3>}
            <p>{props.text}</p>
          </div>
          {props.author === auth.userId && (
            <Button danger onClick={showDeleteWarningHandler}>
              Delete
            </Button>
          )}
        </Card>
      </li>
    </React.Fragment>
  );
};

export default EventItem;
