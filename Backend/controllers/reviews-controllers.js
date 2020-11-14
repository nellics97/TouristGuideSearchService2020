const User = require("../models/user");
const Review = require("../models/review");
const HttpError = require("../models/http-error");

const getReviewsByUser = async (req, res, next) => {
  const userId = req.params.uid;
  console.log("+FASZ");
  console.log(userId);
  let review;
  try {
    review = await Review.find({ receiver: userId });
    console.log(review);
  } catch (err) {
    const error = new HttpError(
      "Fetching reviews failed, please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ reviews: review });
};

const postReview = async (req, res, next) => {
  console.log("psotreview");

  const { author, text, receiver } = req.body;
  const createdReview = new Review({
    author,
    text,
    receiver,
  });

  if (author.toString() === req.params.uid) {
    try {
      await createdReview.save();
    } catch (err) {
      const error = new HttpError(
        "Creating event failed, please try again.",
        500
      );
      return next(error);
    }
  } else {
    const error = new HttpError("You can't leave review as other users!", 403);
    return next(error);
  }

  res.status(201).json({ review: createdReview });
};

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.rid;
  console.log(reviewId);
  let review;
  try {
    console.log("oof");
    review = await Review.findById(reviewId);
    console.log(review);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete review. >:(",
      500
    );
    return next(error);
  }

  if (!review) {
    const error = new HttpError("Couldn't find review for this id", 404);
    return next(error);
  }
  console.log(review.author.toString());
  console.log(req.userData.userId);
  if (review.author.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You really shouldn't delete other users' reviews",
      403
    );
    return next(error);
  }

  try {
    await review.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete event. :(",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted review." });
};

exports.getReviewsByUser = getReviewsByUser;
exports.postReview = postReview;
exports.deleteReview = deleteReview;
