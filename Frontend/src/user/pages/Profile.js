import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Input from "../../shared/components/FormElements/Input";
import ReviewsList from "../components/ReviewsList";
import SingleReview from "../components/SingleReview";
import "./Profile.css";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);
  const userId = useParams().userId;
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();

  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${userId}`
        );
        setLoadedUser(responseData.user);
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

  //const confirmReviewHandler = () => {
  //  setShowModal(false);
  //  console.log("Review ok");
  //};

  const [formState, inputHandler] = useForm(
    {
      text: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  const reviewCreatorHandler = async (event) => {
    event.preventDefault();
    setShowModal(false);
    if (!isLoading && loadedUser) {
      try {
        console.log(formState.inputs.text.value);
        await sendRequest(
          `http://localhost:5000/api/reviews/${userId}`,
          "POST",
          JSON.stringify({
            author: auth.userId,
            text: formState.inputs.text.value,
            receiver: userId,
          }),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );

        history.push("/");
      } catch (err) {}
    }
  };

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
          <SingleReview />
        </Card>
        {!isLoading && loadedUser && loadedUser.id !== auth.userId && (
          <Button onClick={showModalHandler}>Write Review</Button>
        )}
      </div>
      <Modal
        show={showModal}
        onCancel={cancelReviewHandler}
        header="Leave Review!"
        footerClass="event-item__modal-actions"
        footer={
          <React.Fragment>
            <Input
              id="text"
              element="textarea"
              type="text"
              validators={[VALIDATOR_MINLENGTH(10)]}
              error="enter valid review"
              onInput={inputHandler}
            />
            <Button inverse onClick={cancelReviewHandler}>
              Cancel
            </Button>
            <Button
              onClick={reviewCreatorHandler}
              type="submit"
              disabled={!formState.isValid}
              onSubmit={reviewCreatorHandler}
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
