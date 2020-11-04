import React from "react";
import SingleReview from "./SingleReview";

const ReviewsList = (props) => {
  const REVIEWS = ["nagyon jofej", "adom a srácot"];
  return (
    <React.Fragment>
      <h2>Reviews of user:</h2>
      <div>
        <SingleReview items={REVIEWS} />
      </div>
    </React.Fragment>
  );
};

export default ReviewsList;
