const express=require('express');
const cors = require('cors');

const app=express();

app.use(cors({
    origin: 'http://localhost:8081', // Adjust if your frontend runs on a different port
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));


const authRouter=require('./controllers/authController');
const userRouter=require('./controllers/userController');
const messageRouter=require('./controllers/messageController');
const chatRouter=require('./controllers/chatController');
// const port=3000;

// app.listen(port,()=>{
//     console.log('Listening to requests on PORT:'+port)
// })
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
module.exports=app;