import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnection from "./src/db/dbConfig.js";
import userRouter from "./src/routes/userRoutes.js";
import taskRouter from "./src/routes/taskRoute.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: `${process.env.ENDPOINT}`,
    optionsSuccessStatus: 200,
  })
);

// Database Connection
try {
  dbConnection()
    .then(
      app.listen(process.env.PORT || 5000, () => {
        console.log(
          `Server has started at http://localhost:${process.env.PORT}`
        );
      })
    )
    .catch((error) => {
      console.error(`Error connecting to the databse: ${error}`);
    });
} catch (error) {
  console.error(
    `There was an issue connecitng database to the server. ${error}`
  );
}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
