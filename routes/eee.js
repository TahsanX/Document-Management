const express = require("express");
const router = express.Router({ mergeParams: true });
const eeeModel = require("../models/eeeSchema");
const asyncwrap = require("../controllers/wrapasync");
const validate = require("../controllers/validationcheck");
const verifyToken = require("../utils/verifytoken");
router.get("/", verifyToken, async (req, res) => {
  const token = req.session.token;
  const dept = req.user.dept;
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
    token,
    dept,
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
router.get(
  "/:id/view",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await eeeModel.findById(id);
    res.render("eeeViews", { obj, token, dept });
  })
);
router.get(
  "/:id/update",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await eeeModel.findById(id);
    res.render("eeeUpdate", { obj, token, dept });
  })
);
router.post(
  "/:id/update",
  verifyToken,
  validate,
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const obj = req.body;
    req.flash("success", `${req.user.username} you have updated an item`);
    await eeeModel.findByIdAndUpdate(id, obj, { new: true });
    res.redirect("/eee");
  })
);
router.get(
  "/:id/delete",
  verifyToken,
  asyncwrap(async (req, res) => {
    const id = req.params.id;
    req.flash("success", `${req.user.username} you have deleted an item`);
    await eeeModel.findByIdAndDelete(id);
    res.redirect("/eee");
  })
);
router.post(
  "/",
  validate,
  verifyToken,
  asyncwrap(async (req, res) => {
    const obj = req.body;
    req.flash("success", `${req.user.username} you have created an item`);
    await eeeModel.insertMany(obj);
    res.redirect("/eee");
  })
);

module.exports = router;
