const router = require("express").Router({ mergeParams: true });
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controller/courses");

const Course = require("../models/Course");
const advancedResults = require("../middleware/filtering");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description"
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), createCourse);
router
  .route("/:id")
  .get(getCourseById)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;