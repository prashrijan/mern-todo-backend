import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Task } from "../models/taskModel.js";

const addTask = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const { task, status } = req.body;

    if (!task || !status) {
      return res.status(400).json({
        status: "failed",
        message: "One or more required fields are missing or incomplete.",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        status: "failed",
        message: "The access token provided is invalid or expired.",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found for the provided access token.",
      });
    }

    const newTask = await Task.create({
      userId: user._id,
      task,
      status,
    });

    if (!newTask) {
      return res.status(400).json({
        status: "failes",
        message: "Task could not be created.",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Task created successfully",
      newTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "There was an internal server error. Please try again.",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        status: "failed",
        message: "The access token provided is invalid or expired.",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found for the provided access token.",
      });
    }

    const tasks = await Task.find({
      userId: user._id,
    });

    if (tasks.length == 0) {
      return res.status(404).json({
        status: "failed",
        message: "No tasks found for the user.",
      });
    }

    return res.status(200).json({
      status: "success",
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const changeStatus = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;

    const { status } = req.body;
    const id = req.params.id;

    if (!status) {
      return res.status(400).json({
        status: "failed",
        message: "Please complete the fields.",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        status: "failed",
        message: "The access token provided is invalid or expired.",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found for the provided access token.",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      {
        status,
      },
      {
        new: true,
      }
    );
    if (!task) {
      return res.status(404).json({
        status: "failed",
        message:
          "Task not found or you don't have permission to update this task.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const id = req.params.id;

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        status: "failed",
        message: "The access token provided is invalid or expired.",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found for the provided access token.",
      });
    }

    const task = await Task.findOneAndDelete(
      {
        _id: id,
        userId: user._id,
      },
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        status: "failed",
        message:
          "Task not found or you don't have permission to delete this task.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Task deleted successfully.",
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export { addTask, getTasks, changeStatus, deleteTask };
