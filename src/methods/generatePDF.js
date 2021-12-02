const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const generatePDF = async (text) => {
  try {
    const fixed_text = text
      .split(" ")
      .map((node) =>
        node.replace(/^[A-Z]/gi, (first_letter) => first_letter.toUpperCase())
      )
      .join(" ");

    const existingPDFBytes = await fs.readFileSync(
      path.join(__dirname + "../../../public/assets/pdf/cert_part.pdf")
    );

    const certificate = await PDFDocument.load(existingPDFBytes);
    const timesRomanBold = await certificate.embedFont(
      StandardFonts.TimesRomanBold
    );

    const pages = certificate.getPages();
    const firstPage = pages[0];
    const textSize = 35;
    const textWidth = timesRomanBold.widthOfTextAtSize(fixed_text, textSize);
    const textHeight = timesRomanBold.heightAtSize(textSize);

    firstPage.drawText(fixed_text, {
      x: firstPage.getWidth() / 2 - textWidth / 2,
      y: firstPage.getHeight() / 2 + 18,
      width: firstPage.getWidth(),
      size: textSize,
      font: timesRomanBold,
    });

    const toBuffer = (ab) => {
      const buf = Buffer.alloc(ab.byteLength);
      const view = new Uint8Array(ab);
      for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
      }
      return buf;
    };

    const pdfBytes = await certificate.save();
    return toBuffer(pdfBytes);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = generatePDF;
