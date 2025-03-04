const mongoose=require("mongoose");
//connection logic
mongoose.connect(process.env.MONGO_URI);

//connection state
const db=mongoose.connection;


//checking db connection
db.on('connected',()=>{
    console.log("DB connection successfull");
})

db.on('err',()=>{
    console.log("DB Connection error")
})

module.exports=db;