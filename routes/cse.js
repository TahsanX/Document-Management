const express = require("express");
const router = express.Router({ mergeParams: true });
const cseModel = require("../models/cseSchema");
const asyncwrap = require("../controllers/wrapasync");
const validate = require("../controllers/validationcheck");
const verifyToken = require("../utils/verifytoken");
router.get("/", verifyToken, async (req, res) => {
  const token = req.session.token;
  const dept = req.user.dept;
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
    token,
    dept,
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
router.get(
  "/:id/view",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await cseModel.findById(id);
    res.render("cseViews", { obj, token, dept });
  })
);
router.get(
  "/cseAbout",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    res.render("cseAbout", { token, dept });
  })
);
router.get(
  "/:id/update",
  verifyToken,
  asyncwrap(async (req, res) => {
    const token = req.session.token;
    const dept = req.user.dept;
    const { id } = req.params;
    const obj = await cseModel.findById(id);
    res.render("cseUpdate", { obj, token, dept });
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
    await cseModel.findByIdAndUpdate(id, obj, { new: true });
    res.redirect("/cse");
  })
);
router.get(
  "/:id/delete",
  verifyToken,
  asyncwrap(async (req, res) => {
    const id = req.params.id;
    req.flash("success", `${req.user.username} you have deleted an item`);
    await cseModel.findByIdAndDelete(id);
    res.redirect("/cse");
  })
);
router.post(
  "/",
  validate,
  verifyToken,
  asyncwrap(async (req, res) => {
    const obj = req.body;
    req.flash("success", `${req.user.username} you have created an item`);
    await cseModel.insertMany(obj);
    res.redirect("/cse");
  })
);

module.exports = router;
