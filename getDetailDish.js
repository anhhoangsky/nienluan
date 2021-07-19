var jsdom = require("jsdom");
var Crawler = require("crawler");
var db = require("./connectDB");
const { JSDOM } = jsdom;

var c = new Crawler({
  preRequest: function (options, done) {
    console.log("loading: " + options.uri);
    done();
  },
  jQuery: jsdom,
  maxConnections: 10,
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const virtualConsole = new jsdom.VirtualConsole();

      const { document } = new JSDOM(res.body, { virtualConsole }).window;

      // console.log($("title").text());
      try {
        let lstStep = document
          .getElementsByClassName("steep")[0]
          .getElementsByTagName("li");

        let dishID = document.querySelector(
          'meta[name="tt_article_id"]'
        ).content;

        for (let i = 0; i < lstStep.length; ++i) {
          let content = lstStep[i].textContent;
          let data = { content: content, dishID: dishID, order: i };
          db.writerwithoutindex("directions", data);
        }
        let lstIngredients = document
          .getElementsByClassName("choose-ingredients")[0]
          .getElementsByTagName("input");
        for (let ir of lstIngredients) {
          let item = ir.value;
          let data = { item: item, dishID: dishID };
          db.writerwithoutindex("ingredients", data);
        }
      } catch (e) {}
    }
    done();
  },
});

let data = db.reader("dish", {});
data
  .then((res) => {
    let links = [];
    res.forEach((doc) => links.push(doc.data().link));
    return links;
  })
  .then((links) => c.queue(links));
