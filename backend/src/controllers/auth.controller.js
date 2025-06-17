import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try{

    if(!fullName || !email || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    if(password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    const user = await User.findOne({email})

    if(user) return res.status(400).json({message: "Email already exists"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    if(newUser){

      generateToken(newUser._id, res)
      await newUser.save()

      res.status(201).json({
        _id:newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })

    }else {
      res.status(400).json({message: "Invalid user data"});
    }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({message: "Internal server error!"});
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) cari user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // 2) cek password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // 3) buat token (misal set cookie)
    generateToken(user._id, res);

    // 4) kirim data user (tanpa password)
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const logout = (req, res) => {
  try {
    // Kosongkan cookie 'jwt' dengan opsi yang sama
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // hanya di HTTPS
      sameSite: "strict",
      path: "/",          // harus sama dengan path saat set cookie
      maxAge: 0,          // langsung expire
    });

    // Kirim response ke client
    return res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.error("Error in logout controller", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body
    const userId = req.user._id

    if(!profilePic){
      return res.status(400).json({message: "Profile pic is required"})
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      {profilePic:uploadResponse.secure_url}, 
      {new:true}
    )

    res.status(200).json(updatedUser)


  } catch (error) {
    console.error("Error in update profile", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.error("Error in checkAuth controller", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
}
