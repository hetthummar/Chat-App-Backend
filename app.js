const express = require("express");
const morgan = require("morgan");

const userRoutes = require("./router/users");
const customResponses = require("./middlewares/customResponses");
const database = require("./db/connection");
const initializeFirebase = require("./firebase/firebase_init");
const decodeIDToken = require("./middlewares/verify_token");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(morgan("dev"));
app.use(express.urlencoded());
app.use(express.json());
app.use(customResponses);

initializeFirebase();
app.use(decodeIDToken);

app.use("/users", userRoutes);

app.use((req, res) => {
  res.serverError();
});

database.connectToDb(
  () => {
    app.listen(PORT, () => {
      console.log("Server Started g ");
    });
  },
  () => {
    console.log("Database connection failed");
  }
);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  const className = err.constructor.name;

  console.log("err.message :- " + err.message);

  if (className == "BaseError") {
    res.customizedErrorOutPut(err.message, err.statusCode);
  } else {
    //Error thrown by mongoose validation
    if (err.name === "ValidationError") {
      res.validationError({ message: err.message });
    } else {
      res.serverError({ message: err.message });
    }
  }
});
