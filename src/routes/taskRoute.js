import express from "express";
import {
  addTask,
  changeStatus,
  deleteTask,
  getTasks,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.route("/").get(getTasks);
taskRouter.route("/add").post(addTask);
taskRouter.route("/status/:id").post(changeStatus);
taskRouter.route("/delete/:id").delete(deleteTask);

export default taskRouter;
