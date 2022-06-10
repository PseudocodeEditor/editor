const path = require("path");
const express = require("express");

const app = express();
const PORT = 8080;

app.get("/", (rqq, res) => {
  res.sendFile(path.join(__dirname + "/server/index.html"))
});

app.get("/editor.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/editor.bundle.js"));
});

app.get("/css/editor.css", (req, res) => {
  res.sendFile(path.join(__dirname + "/server/css/editor.css"));
});

app.get("/css/style.css", (req, res) => {
  res.sendFile(path.join(__dirname + "/server/css/style.css"));
});

app.get("/media/file.svg", (req, res) => {
  res.sendFile(path.join(__dirname + "/server/media/file.svg"));
});

app.get("/media/psc.svg", (req, res) => {
  res.sendFile(path.join(__dirname + "/server/media/psc.svg"));
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname + "/server/media/favicon.ico"));
});
 
app.listen(PORT, err => {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
