"use strict";
module.exports = function (app) {
  let dishsCtrl = require("./DishsController");

  // todoList Routes
  app.route("/dishs:page?").get(dishsCtrl.get);

  app.route("/dishs/:Id").get(dishsCtrl.detail);
};
