import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Input from "../../shared/components/FormElements/Input";
import ReviewsList from "../components/ReviewsList";
import "./Profile.css";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);
  const userId = useParams().userId;
  console.log(userId);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${userId}`
        );
        setLoadedUser(responseData.user);
        console.log(responseData);
      } catch (err) {}
    };
    fetchUserData();
  }, [sendRequest, userId]);

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
      {!isLoading && loadedUser && auth.userId === loadedUser.id && (
        <Button to={`/users/${loadedUser.id}/update`}> Edit Profile</Button>
      )}
      <div className="profile_picture">
        {!isLoading && loadedUser && (
          <Avatar image={`http://localhost:5000/${loadedUser.image}`} />
        )}
      </div>
      <br></br>
      <div>
        <Card>
          {!isLoading && loadedUser && (
            <React.Fragment>
              <h1>{loadedUser.name}</h1>
              <p>{loadedUser.description}</p>
            </React.Fragment>
          )}
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
