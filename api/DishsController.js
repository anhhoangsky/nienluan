"use strict";

// const util = require('util')
// const mysql = require('mysql')
// const db = require('./../db')
var db = require("../connectDB");

module.exports = {
  get: async (req, res) => {
    // console.log(req.params);
    // res.send(req.params.page || "1");
    if (!req.params.page) {
      let dish = await db.readerTen("dish").then((res) => {
        let data = [];
        res.forEach((doc) => data.push({ name: doc.data().name, id: doc.id }));
        return data;
      });
      //   console.log(dish);
      res.json(dish);
    } else {
      let dish = await db
        .paginateQuery("dish", +req.params.page)
        .then((res) => {
          let data = [];
          res.forEach((doc) =>
            data.push({ name: doc.data().name, id: doc.id })
          );
          return data;
        });
      //   console.log(dish);
      res.json(dish);
    }
  },
  detail: async (req, res) => {
    let data = {};
    await db.readerDoc(`dish/${req.params.Id}`).then((res) => {
      data.name = res.data().name;
      data.id = res.id;
    });
    data.ingredients = [];
    await db.readerDetail("ingredients", req.params.Id).then((res) => {
      res.forEach((doc) => {
        data.ingredients.push(doc.data().item);
      });
    });
    data.directions = [];
    await db.readerDetail("directions", req.params.Id).then((res) => {
      res.forEach((doc) => {
        data.directions.push({
          content: doc.data().content,
          order: doc.data().order,
        });
      });
    });
    data.directions = data.directions.sort(
      (pre, next) => pre.order - next.order
    );
    res.json(data);
  },
};
