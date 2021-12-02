const express = require("express");
const app = express();
const path = require("path");
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const generatePDF = require("./src/methods/generatePDF");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/generate", async (req, res) => {
  console.log(req.body);
  try {
    const fileBuff = await generatePDF(req.body.ref_no);
    res.send(fileBuff);
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "something wen't wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`));
