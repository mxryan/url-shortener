const express = require("express");
const app = express();
const dns = require("dns");
const PORT = process.env.PORT || 5000;

const shortURLs = [];
const originalURLs = [];
const genericErrMsg = {
  error: "You hit a route but something went wrong"
}

// to do:
// 0 still does not work as a shorturl

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
  res.send("<h1>Hi</h1>");
});

app.post("/api/shorturl/new", (req, res) => {
  dns.lookup(req.body.url, (err, address) => {
    if (err) {
      res.json({
        error: "Invalid URL"
      })
    } else {
      shortURLs.push(address);
      originalURLs.push(req.body.url);
      res.json({
        shortURL: originalURLs.length - 1,
        originalURL: req.body.url
      });
    }
  })
});

app.get("/api/shorturl/:arg", (req, res) => {
  console.log(shortURLs);
  if (parseInt(req.params.arg)) {
    if (shortURLs[parseInt(req.params.arg)]) {
      
      console.log(res)
      
      res.redirect("http://"+ originalURLs[parseInt(req.params.arg)])
    } else {
      res.json(genericErrMsg);
    }
  } else {
    res.json(genericErrMsg)
  }
})



app.listen(PORT, () => console.log("Server on"));