const express = require("express");
const router = express.Router({ mergeParams: true });
const cseModel = require("../models/cseSchema");

router.get("/", async (req, res) => {
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
router.get("/:id/view", async (req, res) => {
  const { id } = req.params;
  const obj = await cseModel.findById(id);
  res.render("cseViews", { obj });
});
router.get("/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = await cseModel.findById(id);
  res.render("cseUpdate", { obj });
});
router.post("/:id/update", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  await cseModel.findByIdAndUpdate(id, obj, { new: true });
  res.redirect("/cse");
});
router.get("/:id/delete", async (req, res) => {
  const id = req.params.id;
  await cseModel.findByIdAndDelete(id);
  res.redirect("/cse");
});
router.post("/", async (req, res) => {
  const obj = req.body;
  await cseModel.insertMany(obj);
  res.redirect("/cse");
});

module.exports = router;
