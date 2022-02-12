const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const app = express();
connectDB()

//Routes initialization
const users = require('./routes/users')
const auth = require("./routes/auth");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const reviews = require("./routes/reviews");

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  app.use(fileUpload());


// Security
app.use(mongoSanitize());
app.use(helmet());
app.use(xssClean());
app.use(
  rateLimit({
    windowsMS: process.env.WINDOWMS,
    max: process.env.MAX_REQUEST
  })
);
app.use(hpp());
app.use(cors());

// app.use(express.static(path.join(__dirname, "public")));
app.use(process.env.URL_BOOTCAMPS, bootcamps);
app.use(process.env.URL_COURSES, courses);
app.use(process.env.URL_AUTH, auth);
app.use(process.env.URL_USERS, users);
app.use(process.env.URL_REVIEWS, reviews);
app.use(errorHandler);


// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running on ${PORT} using ${process.env.NODE_ENV} enviroment`
  );
});

// Exception handle
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error ${err.message}`);
    server.close(() => process.exit(1));
  });