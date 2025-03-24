import { User } from "../models/User.model.js";
import { Message } from "../models/Message.model.js";

const getuserfordashboard = async (req, res) => {
  try {
    const loggedinUser = req.user._id;
    const filterduser = await User.find({ _id: { $ne: loggedinUser } }).select(
      "-otp"
    );
    return res.status(200).json(filterduser);
  } catch (error) {
    console.log("error in getuserfordashboard ", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getmessages = async (req, res) => {
  try {
    const { id: uertochatid } = req.params;
    const myid = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myid, recipient: uertochatid },
        { sender: uertochatid, recipient: myid },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error while getmessages ", error);
    res.status(500).json({ error: "internal server error" });
  }
};

const sendmessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: recieverid } = req.params;
    const senderid = req.user._id;

    const newmsg = new Message({
      sender: senderid,
      recipient: recieverid,
      message: message,
    });

    await newmsg.save();

    res.status(200).json(newmsg);
  } catch (error) {
    console.log("error in sending message ", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export { getuserfordashboard, getmessages, sendmessage };
