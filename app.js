const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const cseRoute = require("./routes/cse");
const eeeRoute = require("./routes/eee");
const mechaRoute = require("./routes/mecha");
const civilRoute = require("./routes/civil");
const port = process.env.PORT;
//middleware
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.set("/views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//routes
app.get("/", (req, res) => {
  res.send("I am in home route");
});
//cse
app.use("/cse", cseRoute);
//eee
app.use("/eee", eeeRoute);
//mecha
app.use("/mecha", mechaRoute);
//civil
app.use("/civil", civilRoute);
//Listening to port
app.listen(port, () => {
  console.log(`Listening to server`);
});
