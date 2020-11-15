const express = require("express");
const { check } = require("express-validator");

const reviewsController = require("../controllers/reviews-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:uid", reviewsController.getReviewsByUser);

router.use(checkAuth);

router.post(
  "/:uid",
  [check("text").isLength({ min: 10 })],
  reviewsController.postReview
);

router.delete("/:rid", reviewsController.deleteReview);

module.exports = router;
