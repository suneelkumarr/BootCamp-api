const router = require("express").Router();
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  uploadPhoto
} = require("../controller/bootcamps");

const Bootcamp = require("../models/Bootcamp");

// Other routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");
const advancedResults = require("../middleware/filtering");
const { protect, authorize } = require("../middleware/auth");

router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), uploadPhoto);

module.exports = router;