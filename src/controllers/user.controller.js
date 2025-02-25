import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {

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

const {fullName, email, userName, password} = req.body;
console.log("bimal email is: ",email);

if(
  [fullName,email,userName,password].some((field)=>field?trim() === "")
){

}



});

export { registerUser };
