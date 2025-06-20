import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
}

export const getMessages = async (req, res) => {
  try {
    const {id:userToChatId} = req.params;
    const senderId = req.user._id;

    const messages = await MessageChannel.find({
      $or:[
        {senderId:senderId, receiverId:userToChatId},
        {senderId:userToChatId, receiverId:myId}
      ]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.error("Error in getMessages", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
}

export const sendMessage = async (req, res) => {
  try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;

      let imageUrl;
      if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }

      const newMessage = new MessageChannel({
        senderId,
        receiverId,
        text,
        image: imageUrl
      });

      await newMessage.save()

      // socketio

       res.status(201).json(newMessage)

  } catch (error) {
    console.error("Error in getUsersForSidebar", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
}