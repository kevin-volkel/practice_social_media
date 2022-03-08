const ChatModel = require('../models/ChatModel');
const UserModel = require('../models/UserModel');

//! GET ALL CHATS

const getChats = async (req, res) => {
  try {
    const { userId } = req;
    const user = await ChatModel.findOne({ user: userId }).populate(
      'chats.messagesWith'
    );
    let chatsToBeSent = [];

    if (user.chats.length > 0) {
      chatsToBeSent = await user.chats.map((chat) => ({
        messagesWith: chat.messagesWith._id,
        name: chat.messagesWith.name,
        profilePicURL: chat.messagesWith.profilePicURL,
        lastMessage: chat.messages[chat.messages.length - 1].msg,
        date: chat.messages[chat.messages.length - 1].date,
      }));
    }

    return res.status(200).json(chatsToBeSent);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error @ getChats');
  }
};

//! GET USER INFO

const getUserInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userToFindId);
    if (!user) return res.status(404).send('User not found');
    return res
      .status(200)
      .json({ name: user.name, profilePicURL: user.profilePicURL });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error @ getUserInfo');
  }
};

//! DELETE A CHAT

const deleteChat = async (req, res) => {
  try {
    const { userId } = req;
    const { messagesWith } = req.params;

    const user = await ChatModel.findOne({ user: userId });

    const chatToDelete = user.chats.find(
      (chat) => chat.messagesWith.toString() === messagesWith
    );

    if (!chatToDelete) return res.status(404).send('Chat not found');

    const indexOf = user.chats.findIndex(
      (chat) => chat.messagesWith.toString() === messagesWith
    );

    await user.chats.splice(indexOf, 1)

    await user.save();
    return res.status(200).send('Chat deleted')
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error @ deleteChat');
  }
};

module.exports = { getChats, getUserInfo, deleteChat };
