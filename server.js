// All imports
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileuploade = require("express-fileupload");
const cookieparser = require("cookie-parser");
require("dotenv").config();

//All use
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieparser());
app.use(
  fileuploade({
    useTempFiles: true,
  })
);

//All routes
app.use("/user", require("./routes/userRouter"));

// Connect to MongoDB
const mongoDB = process.env.MONGODB_URI;
mongoose
  .connect(mongoDB, {
    // useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Listening to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
