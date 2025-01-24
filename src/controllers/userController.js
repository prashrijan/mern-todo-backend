import { User } from "../models/userModel.js";

// Registering the user
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "All field must be complete.",
      });
    }

    // check if the user already exists
    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (existedUser) {
      return res.status(409).json({
        status: "failed",
        message: "User with this email or username already exists.",
      });
    }

    // create the user
    const user = await User.create({
      userName,
      email,
      password,
    });

    // remove the password field for security purpose
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong while registering the user.",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "User created successfully.",
      data: createdUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Logging in the user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "All field must be complete.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User does not exists.",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        message: "Incorrect Password",
      });
    }

    const accessToken = await user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      status: "success",
      message: "User logged in successfully.",
      data: loggedInUser,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export { registerUser, loginUser };
