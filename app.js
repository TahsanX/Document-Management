const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const cseModel = require("./models/cseSchema");
const eeeModel = require("./models/eeeSchema");
const mechaModel = require("./models/mechaSchema");
const civilModel = require("./models/civilSchema");
const { date } = require("joi");
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
app.get("/cse", async (req, res) => {
  const get = await cseModel.find();
  const dateall = get.map((obj) => {
    var second = Math.floor((Date.now() - obj.created_at) / 1000);
    var day = Math.floor(second / 86400);
    var hour = Math.floor((second % 86400) / 3600);
    var minute = Math.floor(((second % 86400) % 3600) / 60);
    var second = Math.floor(((second % 86400) % 3600) % 60);
    return `${day}:${hour}:${minute}:${second}`;
  });
  var lap = 0,
    key = 0,
    logic = 0,
    multi = 0,
    cost = 0,
    elements = 0;
  get.map((obj) => {
    cost += obj.price;
    elements += obj.quantity;
    if (obj.item === "laptop") {
      lap += obj.quantity;
    } else if (obj.item === "keyboard") {
      key += obj.quantity;
    } else if (obj.item === "logic-gates") {
      logic += obj.quantity;
    } else {
      multi += obj.quantity;
    }
  });
  res.render("cseRoute", {
    get,
    lap,
    key,
    logic,
    multi,
    cost,
    elements,
    dateall,
  });
});
app.get("/cse/:id/view", async (req, res) => {
  const { id } = req.params;
  const obj = await cseModel.findById(id);
  res.render("cseViews", { obj });
});
app.get("/cse/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = await cseModel.findById(id);
  res.render("cseUpdate", { obj });
});
app.post("/cse/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  await cseModel.findByIdAndUpdate(id, obj, { new: true });
  res.redirect("/cse");
});
app.get("/cse/:id/delete", async (req, res) => {
  const id = req.params.id;
  await cseModel.findByIdAndDelete(id);
  res.redirect("/cse");
});
app.post("/cse", async (req, res) => {
  const obj = req.body;
  await cseModel.insertMany(obj);
  res.redirect("/cse");
});

//eee
app.get("/eee", async (req, res) => {
  const get = await eeeModel.find();
  const dateall = get.map((obj) => {
    var second = Math.floor((Date.now() - obj.created_at) / 1000);
    var day = Math.floor(second / 86400);
    var hour = Math.floor((second % 86400) / 3600);
    var minute = Math.floor(((second % 86400) % 3600) / 60);
    var second = Math.floor(((second % 86400) % 3600) % 60);
    return `${day}:${hour}:${minute}:${second}`;
  });
  var osci = 0,
    resis = 0,
    transistor = 0,
    transformer = 0,
    cost = 0,
    elements = 0;
  get.map((obj) => {
    cost += obj.price;
    elements += obj.quantity;
    if (obj.item === "oscilloscope") {
      osci += obj.quantity;
    } else if (obj.item === "resistor") {
      resis += obj.quantity;
    } else if (obj.item === "transistor") {
      transistor += obj.quantity;
    } else {
      transformer += obj.quantity;
    }
  });
  res.render("eeeRoute", {
    get,
    osci,
    resis,
    transistor,
    transformer,
    cost,
    elements,
    dateall,
  });
});
app.get("/eee/:id/view", async (req, res) => {
  const { id } = req.params;
  const obj = await eeeModel.findById(id);
  res.render("eeeViews", { obj });
});
app.get("/eee/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = await eeeModel.findById(id);
  res.render("eeeUpdate", { obj });
});
app.post("/eee/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  await eeeModel.findByIdAndUpdate(id, obj, { new: true });
  res.redirect("/eee");
});
app.get("/eee/:id/delete", async (req, res) => {
  const id = req.params.id;
  await eeeModel.findByIdAndDelete(id);
  res.redirect("/eee");
});
app.post("/eee", async (req, res) => {
  const obj = req.body;
  await eeeModel.insertMany(obj);
  res.redirect("/eee");
});

//mecha
app.get("/mecha", async (req, res) => {
  const get = await mechaModel.find();
  const dateall = get.map((obj) => {
    var second = Math.floor((Date.now() - obj.created_at) / 1000);
    var day = Math.floor(second / 86400);
    var hour = Math.floor((second % 86400) / 3600);
    var minute = Math.floor(((second % 86400) % 3600) / 60);
    var second = Math.floor(((second % 86400) % 3600) % 60);
    return `${day}:${hour}:${minute}:${second}`;
  });
  var lathe_machine = 0,
    heat_exchanger = 0,
    pressure_gauge = 0,
    pump = 0,
    cost = 0,
    elements = 0;
  get.map((obj) => {
    cost += obj.price;
    elements += obj.quantity;
    if (obj.item === "lathe_machine") {
      lathe_machine += obj.quantity;
    } else if (obj.item === "heat_exchanger") {
      heat_exchanger += obj.quantity;
    } else if (obj.item === "pressure_gauge") {
      pressure_gauge += obj.quantity;
    } else {
      pump += obj.quantity;
    }
  });
  res.render("mechaRoute", {
    get,
    lathe_machine,
    heat_exchanger,
    pressure_gauge,
    pump,
    cost,
    elements,
    dateall,
  });
});
app.get("/mecha/:id/view", async (req, res) => {
  const { id } = req.params;
  const obj = await mechaModel.findById(id);
  res.render("mechaViews", { obj });
});
app.get("/mecha/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = await mechaModel.findById(id);
  res.render("mechaUpdate", { obj });
});
app.post("/mecha/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  await mechaModel.findByIdAndUpdate(id, obj, { new: true });
  res.redirect("/mecha");
});
app.get("/mecha/:id/delete", async (req, res) => {
  const id = req.params.id;
  await mechaModel.findByIdAndDelete(id);
  res.redirect("/mecha");
});
app.post("/mecha", async (req, res) => {
  const obj = req.body;
  await mechaModel.insertMany(obj);
  res.redirect("/mecha");
});

//civil
app.get("/civil", async (req, res) => {
  const get = await civilModel.find();
  const dateall = get.map((obj) => {
    var second = Math.floor((Date.now() - obj.created_at) / 1000);
    var day = Math.floor(second / 86400);
    var hour = Math.floor((second % 86400) / 3600);
    var minute = Math.floor(((second % 86400) % 3600) / 60);
    var second = Math.floor(((second % 86400) % 3600) % 60);
    return `${day}:${hour}:${minute}:${second}`;
  });
  var Sieve = 0,
    Theodolite = 0,
    Inclinometer = 0,
    Piezometer = 0,
    cost = 0,
    elements = 0;
  get.map((obj) => {
    cost += obj.price;
    elements += obj.quantity;
    if (obj.item === "Sieve") {
      Sieve += obj.quantity;
    } else if (obj.item === "Theodolite") {
      Theodolite += obj.quantity;
    } else if (obj.item === "Inclinometer") {
      Inclinometer += obj.quantity;
    } else {
      Piezometer += obj.quantity;
    }
  });
  res.render("civilRoute", {
    get,
    Sieve,
    Theodolite,
    Inclinometer,
    Piezometer,
    cost,
    elements,
    dateall,
  });
});
app.get("/civil/:id/view", async (req, res) => {
  const { id } = req.params;
  const obj = await civilModel.findById(id);
  res.render("civilViews", { obj });
});
app.get("/civil/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = await civilModel.findById(id);
  res.render("civilUpdate", { obj });
});
app.post("/civil/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  await civilModel.findByIdAndUpdate(id, obj, { new: true });
  res.redirect("/civil");
});
app.get("/civil/:id/delete", async (req, res) => {
  const id = req.params.id;
  await civilModel.findByIdAndDelete(id);
  res.redirect("/civil");
});
app.post("/civil", async (req, res) => {
  const obj = req.body;
  await civilModel.insertMany(obj);
  res.redirect("/civil");
});
//Listening to port
app.listen(port, () => {
  console.log(`Listening to server`);
});
