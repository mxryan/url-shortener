const express = require("express");
const app = express();
const dns = require("dns");
const path = require("path");
const PORT = process.env.PORT || 5000;

const shortURLs = [];
const originalURLs = ["freecodecamp.org"];
const genericErrMsg = {
  error: "You hit a route but something went wrong"
}

// to do:
// 0 still does not work as a shorturl
// eliminate extra URL array

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join("public")));

app.get("/", (req, res) => {
  res.sendFile("public/index.html")
});

app.post("/api/shorturl/new", (req, res) => {
  console.log("Hit post route");
  dns.lookup(req.body.url, (err, address) => {
    if (err) {
      res.json({
        error: "Invalid URL"
      })
    } else {
      shortURLs.push(address);
      originalURLs.push(req.body.url);
      res.json({
        short_url: originalURLs.length - 1,
        original_url: req.body.url
      });
    }
  })
});


app.get("/api/shorturl/:arg", (req, res) => {
  console.log(originalURLs);
  if (parseInt(req.params.arg)) {
    console.log("outer if");
    if (originalURLs[parseInt(req.params.arg)]) {
      console.log("inner if");
      res.redirect("http://"+ originalURLs[parseInt(req.params.arg)])
    } else {
      console.log("inner else");
      res.json(genericErrMsg);
    }
  } else {
    console.log("outer else");
    res.json(genericErrMsg)
  }
})



app.listen(PORT, () => console.log("Server on"));