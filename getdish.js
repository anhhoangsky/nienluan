var jsdom = require("jsdom");
var Crawler = require("crawler");
var db = require("./connectDB");
const { JSDOM } = jsdom;

var c = new Crawler({
  jQuery: jsdom,
  maxConnections: 10,
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const virtualConsole = new jsdom.VirtualConsole();

      const { document } = new JSDOM(res.body, { virtualConsole }).window;

      // console.log($("title").text());

      let lstDish = document
        .getElementsByClassName("list-dish grid__3")[0]
        .getElementsByClassName("title_news");

      for (let item of lstDish) {
        let name = item.textContent;
        let link = item.getElementsByTagName("a")[0].href;
        let data = { name: name, link: link };
        let idx = link.slice(link.lastIndexOf("-") + 1, link.length - 5);
        db.writer("dish", data, idx);
      }
    }
    done();
  },
});
let data = db.reader("topic", {});
data
  .then((res) => {
    let links = [];
    res.forEach((doc) => {
      let page = Math.ceil(doc.data().quantum / 15);
      for (let i = 1; i <= page; ++i) {
        links.push(`https://vnexpress.net${doc.data().link}-p${i}`);
      }
    });
    return links;
  })
  .then((links) => c.queue(links));
//   .then((links) => console.log(links));

// db.count("dish");
