import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useParams } from "react-router-dom";

const SingleReview = () => {
  const userId = useParams().userId;
  const [loadedReviews, setLoadedReviews] = useState();
  const { isLoading, sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchReviews = async () => {
      console.log(userId);
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/reviews/${userId}`
        );
        setLoadedReviews(responseData.review);
        console.log("fasz");
        console.log(loadedReviews.author);
        console.log(loadedReviews.text);
      } catch (err) {}
    };
    fetchReviews();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      <h2>rewies</h2>
      {!isLoading && loadedReviews && (
        <React.Fragment>
          <h2>rewiek</h2>
          <h2>{loadedReviews.author}</h2>
          <h3>{loadedReviews.text}</h3>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default SingleReview;
