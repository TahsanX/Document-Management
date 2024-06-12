const express = require("express");
const router = express.Router({ mergeParams: true });
const civilModel = require("../models/civilSchema");

router.get("/", async (req, res) => {
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
router.get("/:id/view", async (req, res) => {
  const { id } = req.params;
  const obj = await civilModel.findById(id);
  res.render("civilViews", { obj });
});
router.get("/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = await civilModel.findById(id);
  res.render("civilUpdate", { obj });
});
router.post("/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  await civilModel.findByIdAndUpdate(id, obj, { new: true });
  res.redirect("/civil");
});
router.get("/:id/delete", async (req, res) => {
  const id = req.params.id;
  await civilModel.findByIdAndDelete(id);
  res.redirect("/civil");
});
router.post("/", async (req, res) => {
  const obj = req.body;
  await civilModel.insertMany(obj);
  res.redirect("/civil");
});
module.exports = router;
