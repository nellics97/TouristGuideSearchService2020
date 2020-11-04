import React, { useState } from "react";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Input from "../../shared/components/FormElements/Input";
import ReviewsList from "../components/ReviewsList";
import "./Profile.css";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const cancelReviewHandler = () => {
    setShowModal(false);
  };

  const confirmReviewHandler = () => {
    setShowModal(false);
    console.log("Review ok");
  };

  const [formState, inputHandler] = useForm(
    {
      review: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  return (
    <React.Fragment>
      <div className="username">
        <h1>nelli</h1>
      </div>
      <div className="profile_picture">
        <Avatar image="https://i.imgur.com/187Y4u3.png" />
      </div>
      <br></br>
      <div>
        <Card>
          <h3>
            itt van a user bemutatkozása. biztos érdekes dolgokat ír magáról
          </h3>
        </Card>
      </div>
      <div>
        <Card>
          <ReviewsList />
        </Card>
        <Button onClick={showModalHandler}>Write Review</Button>
      </div>

      <Modal
        show={showModal}
        onCancel={cancelReviewHandler}
        header="Leave Review!"
        footerClass="event-item__modal-actions"
        footer={
          <React.Fragment>
            <Input
              id="review"
              element="textarea"
              type="text"
              validators={[VALIDATOR_MINLENGTH(10)]}
              error="enter valid review"
              onInput={inputHandler}
              value={formState.inputs.review.value}
              valid={formState.inputs.review.isValid}
            />
            <Button inverse onClick={cancelReviewHandler}>
              Cancel
            </Button>
            <Button
              onClick={confirmReviewHandler}
              type="submit"
              disabled={!formState.isValid}
            >
              Ok
            </Button>
          </React.Fragment>
        }
      ></Modal>
    </React.Fragment>
  );
};

export default Profile;
