import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";

//---Algorithm or steps for user registration---/

// get user details from frontend
// validation - not empty
// check if user already exists: username, email
// check for images,check avatar
// upload them to cloudinary , avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// return res

const registerUser = asyncHandler(async (req, res) => {
  /*
    res.status(200).json({
      message: "ok",
    });
  */

  const { fullName, email, userName, password } = req.body;
  console.log(
    "Bimal destructured from req.body are: ",
    fullName,
    " ",
    email,
    " ",
    userName,
    " ",
    password
  );

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(
      400,
      "Bimal, All fields are required. Speaking from user.controller.js."
    );
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "Bimal User with this userName or email already exists."
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, " Bimal Avatar file is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Bimal Something went wrong while registering the user.Server side error."
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, " Bimal User registered successfully .")
    );
});

export { registerUser };
