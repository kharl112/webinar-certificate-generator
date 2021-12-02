const express = require("express");
const app = express();
const path = require("path");
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const fs = require("fs");
const generatePDF = require("./src/methods/generatePDF");
require("dotenv").config();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/generate", async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const fixed_rows = rows.map((node) => ({
      name: node._rawData[3],
      email: node._rawData[1],
      id_no: node._rawData[2],
      ref_no: node._rawData[5].replace(/\s/g, ""),
    }));

    console.log(fixed_rows);

    const [participant] = fixed_rows.filter(
      ({ id_no, ref_no }) =>
        req.body.ref_no.replace(/\s/g, "") === ref_no &&
        id_no === req.body.id_no
    );

    if (!participant) {
      return res.status(404).send({
        message:
          "participant information was not found, please contact the organizing team if this is a mistake",
      });
    }

    const fileBuff = await generatePDF(participant.name);
    res.send(fileBuff);
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`));
