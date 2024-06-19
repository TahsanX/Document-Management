const express = require("express");
const router = express.Router({ mergeParams: true });
const mechaModel = require("../models/mechaSchema");
const asyncwrap = require("../controllers/wrapasync");
const validate = require("../controllers/validationcheck");
const verifyToken = require("../utils/verifytoken");
router.get("/", verifyToken, async (req, res) => {
  const token = req.session.token;
  const dept = req.user.dept;
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
    token,
    dept,
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
router.get(
  "/:id/view",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await mechaModel.findById(id);
    res.render("mechaViews", { obj, token, dept });
  })
);
router.get(
  "/:id/update",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await mechaModel.findById(id);
    res.render("mechaUpdate", { obj, token, dept });
  })
);
router.post(
  "/:id/update",
  validate,
  verifyToken,
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    req.flash("success", `${req.user.username} you have updated an item`);
    const obj = req.body;
    await mechaModel.findByIdAndUpdate(id, obj, { new: true });
    res.redirect("/mecha");
  })
);
router.get(
  "/:id/delete",
  verifyToken,
  asyncwrap(async (req, res) => {
    const id = req.params.id;
    req.flash("success", `${req.user.username} you have deleted an item`);
    await mechaModel.findByIdAndDelete(id);
    res.redirect("/mecha");
  })
);
router.post(
  "/",
  validate,
  verifyToken,
  asyncwrap(async (req, res) => {
    const obj = req.body;
    req.flash("success", `${req.user.username} you have created an item`);
    await mechaModel.insertMany(obj);
    res.redirect("/mecha");
  })
);

module.exports = router;
