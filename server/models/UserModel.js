const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must provide a name']
  },
  email: {
    type: String,
    required: [true, 'Must provide an email'],
    unique: [true, 'Email already taken']
  },
  password: {
    type: String,
    required: [true, 'Must provide a password'],
    select: false
  },
  username: {
    type: String,
    required: [true, 'Must provide a username'],
    unique: [true, 'Username already taken'],
    trim: true,
  },
  profilePicURL: {
    type: String,
  },
  newMessagePopup: {
    type: Boolean,
    default: true,
  },
  unreadMessage: {
    type: Boolean,
    default: true,
  },
  unreadNotification: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetToken: { type: String },
  expireToken: {type: Date},
},
  {timestamps: true}
)

module.exports = mongoose.model('User', UserSchema)