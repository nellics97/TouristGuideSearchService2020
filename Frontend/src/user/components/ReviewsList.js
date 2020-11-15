import React from "react";

import Card from "../../shared/components/UIElements/Card";
import "../../events/components/EventList.css";
import SingleReview from "./SingleReview";

const ReviewsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="event_list center">
        <Card>
          <h2>No reviews yet</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="event-list">
      {props.items.map((review) => (
        <SingleReview
          key={review.id}
          id={review.id}
          author={review.author}
          text={review.text}
          onDelete={props.onDeleteReview}
        />
      ))}
    </ul>
  );
};

export default ReviewsList;
