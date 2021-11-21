const express = require("express");
const morgan = require("morgan");

const userRoutes = require("./router/users");
const userUpdateRoutes = require("./router/user_update_route");
const messageRoutes = require("./router/messages");
const userConnectionStatusRoutes = require("./router/user_connection_status.js");
const customResponses = require("./middlewares/customResponses");
const database = require("./db/connection");
const initializeFirebase = require("./firebase/firebase_init");
const decodeIDToken = require("./middlewares/verify_token");
const { makeSocketConnection } = require("./services/socket_service");
const PORT = process.env.PORT || 5000;

const app = express();
const server = require("http").createServer(app);


app.use(morgan("dev"));
app.use(express.urlencoded());
app.use(express.json());
app.use(customResponses);

app.use(morgan("combined"));
initializeFirebase();
app.use("/users", userRoutes);
app.use(decodeIDToken);
app.use("/userUpdate", userUpdateRoutes);
console.log("GOIGN TO SG ROUTe");
app.use("/messages", messageRoutes);
app.use("/connectionStatus", userConnectionStatusRoutes);

app.use((req, res) => {
  res.serverError();
});

database.connectToDb(
  () => {
    makeSocketConnection(server);

    server.listen(PORT, () => {
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
