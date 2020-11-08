import React, { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./EventItem.css";

const EventItem = (props) => {
  const { isLoading } = useHttpClient();
  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
      <li className="event-item">
        <Card className="event-item__content">
          {isLoading && <LoadingSpinner asOverLay />}
          <div className="event-item__info">
            <h2>{props.title}</h2>
            <h3>{props.place}</h3>
          </div>
          <div className="event-item__actions">
            {auth.isLoggedIn && (
              <Button to={`/events/${props.id}`}>Check</Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default EventItem;
