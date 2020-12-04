import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ReviewList from "./ReviewsList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Reviews = () => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedReviews, setLoadedReviews] = useState();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/reviews/${userId}`
        );
        setLoadedReviews(responseData.reviews);
      } catch (err) {}
    };
    fetchReviews();
  }, [sendRequest, userId]);

  const reviewDeleteHandler = (deletedReviewId) => {
    setLoadedReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== deletedReviewId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedReviews && (
        <ReviewList
          items={loadedReviews}
          onDeleteReview={reviewDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Reviews;
