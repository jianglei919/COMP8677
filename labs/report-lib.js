// Shared Word (.docx) report generator for COMP8677 labs.
//
// Each lab keeps a tiny build_report.js that only describes its content and
// calls makeReport() from here. The boilerplate (helpers, styles, page setup,
// packing) lives in this one file.
//
// Usage (labs/labN/build_report.js):
//
//   const { makeReport } = require("../report-lib");
//   makeReport({
//     labDir: __dirname,                       // screens/ is found automatically
//     outName: "LabN_Report.docx",
//     title:    "COMP8677 — Lab N Report",
//     subtitle: "Optional one-line subtitle",
//     author:   "Lei Jiang  ·  Student ID: 110208645",
//     body: ({ P, H1, H2, code, figure, spacer, readCode }) => [
//       H1("1. Section"),
//       P("Some prose."),
//       ...code("$ a command"),
//       ...figure("Shot.png", "Figure 1 — caption", 480),
//     ],
//   });
//
// Run:  cd labs && npm install      (once, installs docx into labs/node_modules)
//       node labN/build_report.js

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun,
  AlignmentType, HeadingLevel,
} = require("docx");

// Build an ImageRun from a PNG, scaled to fit maxW (reads intrinsic size from
// the PNG IHDR chunk: width at bytes 16-19, height at 20-23).
function imgRun(file, screensDir, maxW) {
  const buf = fs.readFileSync(path.join(screensDir, file));
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const scale = Math.min(1, maxW / w);
  return new ImageRun({
    type: "png",
    data: buf,
    transformation: { width: Math.round(w * scale), height: Math.round(h * scale) },
    altText: { title: file, description: file, name: file },
  });
}

// Content helpers, bound to one lab's screens/ directory.
function makeHelpers(screensDir) {
  const P = (text, opts = {}) =>
    new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 120 } });

  const H1 = (text) =>
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text })] });

  const H2 = (text) =>
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text })] });

  const code = (text) =>
    text.split("\n").map(line =>
      new Paragraph({
        children: [new TextRun({ text: line || " ", font: "Courier New", size: 18 })],
        spacing: { after: 0 },
      }));

  const figure = (file, caption, maxW = 600) => [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [imgRun(file, screensDir, maxW)],
      spacing: { before: 120, after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: caption, italics: true, size: 20 })],
      spacing: { after: 200 },
    }),
  ];

  const spacer = (after = 200) =>
    new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after } });

  const readCode = (p) => fs.readFileSync(p, "utf8");

  return { P, H1, H2, code, figure, spacer, readCode };
}

function titleBlock({ title, subtitle, author }) {
  const out = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 36 })],
      spacing: { after: subtitle || author ? 80 : 360 },
    }),
  ];
  if (subtitle) out.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: subtitle, size: 24 })],
    spacing: { after: 80 },
  }));
  if (author) out.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: author, size: 22 })],
    spacing: { after: 360 },
  }));
  return out;
}

// Build + write the .docx. Returns a Promise resolving to the output path.
function makeReport({ labDir, screensDir, outName, title, subtitle, author, body }) {
  if (!labDir) throw new Error("makeReport: labDir is required");
  if (!outName) throw new Error("makeReport: outName is required");
  screensDir = screensDir || path.join(labDir, "screens");

  const h = makeHelpers(screensDir);
  const children = [
    ...titleBlock({ title, subtitle, author }),
    ...(typeof body === "function" ? body(h) : (body || [])),
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Calibri", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 30, bold: true, font: "Calibri" },
          paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Calibri" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    }],
  });

  return Packer.toBuffer(doc).then(buf => {
    const out = path.join(labDir, outName);
    fs.writeFileSync(out, buf);
    console.log("Wrote", out, buf.length, "bytes");
    return out;
  });
}

module.exports = { makeReport, makeHelpers, imgRun };
