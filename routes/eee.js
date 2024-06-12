const express = require("express");
const router = express.Router({ mergeParams: true });
const eeeModel = require("../models/eeeSchema");

router.get("/", async (req, res) => {
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
router.get("/:id/view", async (req, res) => {
  const { id } = req.params;
  const obj = await eeeModel.findById(id);
  res.render("eeeViews", { obj });
});
router.get("/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = await eeeModel.findById(id);
  res.render("eeeUpdate", { obj });
});
router.post("/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  await eeeModel.findByIdAndUpdate(id, obj, { new: true });
  res.redirect("/eee");
});
router.get("/:id/delete", async (req, res) => {
  const id = req.params.id;
  await eeeModel.findByIdAndDelete(id);
  res.redirect("/eee");
});
router.post("/", async (req, res) => {
  const obj = req.body;
  await eeeModel.insertMany(obj);
  res.redirect("/eee");
});

module.exports = router;
