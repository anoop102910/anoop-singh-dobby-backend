const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const compression = require("compression");
const helmet = require("helmet")

const { DB_URI ,CLIENT_URI} = require("./config/config");
const imageRoute = require("./routes/image.route");
const authRoute= require('./routes/auth.route');


const app = express();

app.use(express.json());
app.use(fileUpload({ limits: { fileSize: "10*1024*1024" } }));
app.use(
  cors({
    origin: CLIENT_URI,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());
app.use("/api/image", imageRoute);
app.use("/api/auth",authRoute);
app.use(compression());



app.get("/", (req, res) => {
  res.status(200).json({ succuss: true, message: "Listening on port number 5000" });
});


app.get("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;


app.listen(PORT, err => {
  if (err) console.log(err);
  else console.log(`Listening on port number ${PORT}`);
});
