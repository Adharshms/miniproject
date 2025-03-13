


const dotenv = require("dotenv");
dotenv.config();

const dbconfig = require('./config/dbConfig');
const app = require("./app");

// ✅ Use a single PORT declaration
const PORT = process.env.PORT || 3000;

// ✅ Listen on 0.0.0.0 for Render deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log("🚀 Listening to requests on port: " + PORT);
});

/*const dotenv = require("dotenv");

dotenv.config();


const dbconfig=require('./config/dbConfig')

const app=require("./app");

const port=process.env.PORT || 3000;


app.listen(port, '0.0.0.0',()=>{
  console.log("listening to the request on port:"+port);
});
const PORT = process.env.PORT || 3000;  // ✅ Must use process.env.PORT
*/