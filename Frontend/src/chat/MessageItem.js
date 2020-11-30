import React, { useState, useEffect } from "react";

import Card from "../shared/components/UIElements/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";

const MessageItem = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${props.author}`
        );
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUserData();
  }, [sendRequest, props.author]);

  return (
    <React.Fragment>
      <li>
        <Card>
          {isLoading && <LoadingSpinner asOverLay />}
          {loadedUser && (
            <div>
              <h3>{loadedUser.name}</h3>
              <p>{props.time}</p>
              <p>{props.text}</p>
            </div>
          )}
        </Card>
      </li>
    </React.Fragment>
  );
};

export default MessageItem;
