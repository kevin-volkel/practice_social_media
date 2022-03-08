//* Express App Setup
const express = require('express');
const { connectDB } = require('./server/util/connect');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;

//* Next App Setup
const next = require('next');

//! create a check for development vs production
const dev = process.env.NODE_ENV !== 'production';

//! there are giant error warnings that pop up when in development
const nextApp = next({ dev });

//! this is a built-in next router that will handle all requests made to the server
const handler = nextApp.getRequestHandler();

//* Middlewares
const { authMiddleware } = require('./server/middleware/auth')

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

//! ROUTERS
const userRoute = require('./server/routes/userRoute');
const authRoute = require('./server/routes/authRoute');
const uploadRoute = require('./server/routes/uploadPicRoute')
const searchRoute = require('./server/routes/searchRoute')
const postsRoute = require('./server/routes/postsRoute')
const profileRoute = require('./server/routes/profileRoute')
const messageRoute = require('./server/routes/messageRoute')

app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/upload', uploadRoute)
app.use('/api/v1/search', searchRoute)
app.use('/api/v1/posts', authMiddleware, postsRoute)
app.use('/api/v1/profile', authMiddleware, profileRoute)
app.use('/api/v1/messages', authMiddleware, messageRoute)

// ! SOCKETS
// const { Server } = require("socket.io");

// const io = new Server(nextApp, 3000);
// const io = require('socket.io')(server)

// io.on('connect', (socket) => {
//   socket.on('pingServer', (data) => {
//     console.log(data);
//   })
// })

connectDB();

nextApp.prepare().then(() => {
  app.all('*', (req, res) => handler(req, res));
  app.listen(PORT, (err) => {
    if (err) console.error(err);
    else console.log(`Server listening @ ${PORT}`);
  });
});
