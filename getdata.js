var jsdom = require("jsdom");
var Crawler = require("crawler");
var db = require("./connectDB");
const { JSDOM } = jsdom;

var cTopic = new Crawler({
  jQuery: jsdom,
  maxConnections: 10,
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const virtualConsole = new jsdom.VirtualConsole();

      const { document } = new JSDOM(res.body, { virtualConsole }).window;
      // var $ = res.document;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      // console.log($("title").text());
      let lstTopic = document.getElementsByClassName("art_item");
      for (let item of lstTopic) {
        let name = item.getElementsByClassName("title_news")[0].textContent;
        let qString = item.getElementsByClassName("description")[0].textContent;
        let quantum = +qString.slice(0, qString.indexOf(" "));
        let link = item
          .getElementsByClassName("title_news")[0]
          .getElementsByTagName("a")[0].href;
        let data = { name: name, quantum: quantum, link: link };
        let idx = link.slice(link.lastIndexOf("-") + 1);
        db.writer("topic", data, idx);
      }
    }
    done();
  },
});

// Queue some HTML code directly without grabbing (mostly for tests)
// c.queue([
//   {
//     html: "<p>This is a <strong>test</strong></p>",
//   },
// ]);
