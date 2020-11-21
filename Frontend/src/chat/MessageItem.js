import React from "react";

import Card from "../shared/components/UIElements/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";

const MessageItem = (props) => {
  const { isLoading } = useHttpClient();

  return (
    <React.Fragment>
      <li>
        <Card c>
          {isLoading && <LoadingSpinner asOverLay />}
          <div>
            <h3>{props.author}</h3>
            <p>{props.time}</p>
            <p>{props.text}</p>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default MessageItem;
