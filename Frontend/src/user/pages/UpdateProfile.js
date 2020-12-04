import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  const history = useHistory();
  const [imageData, setImageData] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
        );
        setLoadedUser(responseData.user);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true,
            },
            email: {
              value: responseData.user.email,
              isValid: true,
            },
            image: {
              value: "",
              isValid: true,
            },
            description: {
              value: responseData.user.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId, setFormData]);

  const eventUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    getBase64();
    try {
      //const formData = new FormData();
      //formData.set("name", formState.inputs.name.value);
      //formData.set("email", formState.inputs.email.value);
      //formData.set("description", formState.inputs.description.value);
      //formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/${userId}/update`,
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          //image: imageData,
          description: formState.inputs.description.value,
        }),
        //formData,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      console.log(imageData);
      history.push("/");
    } catch (err) {}
  };

  useEffect(() => {
    console.log(imageData);
  }, [imageData]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedUser && !error) {
    return (
      <div className="center">
        <Card>
          <h2>No user found</h2>
        </Card>
      </div>
    );
  }

  function getBase64() {
    let img = formState.inputs.image.value;
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = function () {
      setImageData(reader.result);
      //console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUser && (
        <form className="update-user-form" onSubmit={eventUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            error="enter valid name"
            onInput={inputHandler}
            value={loadedUser.name}
            valid={true}
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="E-mail"
            validators={[VALIDATOR_REQUIRE()]}
            error="enter valid email"
            onInput={inputHandler}
            value={loadedUser.email}
            valid={true}
          />
          <ImageUpload center id="image" onInput={inputHandler} />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            error="enter valid description"
            onInput={inputHandler}
            value={loadedUser.description}
            valid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Profile
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateProfile;
