const express = require("express");
const router = express.Router({ mergeParams: true });
const civilModel = require("../models/civilSchema");
const asyncwrap = require("../controllers/wrapasync");
const validate = require("../controllers/validationcheck");
const verifyToken = require("../utils/verifytoken");
router.get(
  "/",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
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
      token,
      dept,
      get,
      Sieve,
      Theodolite,
      Inclinometer,
      Piezometer,
      cost,
      elements,
      dateall,
    });
  })
);
router.get(
  "/:id/view",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await civilModel.findById(id);
    res.render("civilViews", { obj, token, dept });
  })
);
router.get(
  "/:id/update",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await civilModel.findById(id);
    res.render("civilUpdate", { obj, token, dept });
  })
);
router.get(
  "/civilAbout",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    res.render("civilAbout", { token, dept });
  })
);
router.post(
  "/:id/update",
  validate,
  verifyToken,
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const obj = req.body;
    req.flash("success", `${req.user.username} you have updated an item`);
    await civilModel.findByIdAndUpdate(id, obj, { new: true });
    res.redirect("/civil");
  })
);
router.get(
  "/:id/delete",
  verifyToken,
  asyncwrap(async (req, res) => {
    const id = req.params.id;
    req.flash("success", `${req.user.username} you have deleted an item`);
    await civilModel.findByIdAndDelete(id);
    res.redirect("/civil");
  })
);
router.post(
  "/",
  validate,
  verifyToken,
  asyncwrap(async (req, res) => {
    const obj = req.body;
    req.flash("success", `${req.user.username} you have created an item`);
    await civilModel.insertMany(obj);
    res.redirect("/civil");
  })
);
module.exports = router;
