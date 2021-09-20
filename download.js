const fs = require("fs");
const { http, https } = require("follow-redirects");
const { Writable } = require("stream");

const findFirstWordIndex = (lines) => {
  const firstWordIndex = lines.findIndex((line, index) => {
    const nextLine = line[index + 1] || "";
    const isNextLineInOrder = line.localeCompare(nextLine) === 1;
    const hasWhitespace = Boolean(line.match(/\s/));
    const isEmpty = line.trim().length === 0;

    return !isEmpty && !hasWhitespace && isNextLineInOrder;
  });

  if (typeof firstWordIndex === "undefined") {
    throw new Error("Cannot find index of the first word in the file");
  }

  return firstWordIndex;
};

const extractWords = (file) => {
  const lines = file.replace(/\r/g, "").split("\n");
  const firstWordIndex = findFirstWordIndex(lines);
  const words = lines.slice(firstWordIndex).filter(Boolean);
  return words.map((word) => {
    return word.replace(/1/g, "ch").replace(/2/g, "ll").replace(/3/g, "rr");
  });
};

const downloadFile = (url, outputStream) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, (response) => {
      if (
        typeof response.statusCode === "undefined" ||
        response.statusCode >= 400
      ) {
        reject();
        return;
      }

      response.pipe(outputStream);
      response.on("error", reject);
      response.on("end", resolve);
    });
    request.on("error", reject);
  });
};

const downloadWords = async (url) => {
  const tempFilename = "tmp.txt";
  await downloadFile(url, fs.createWriteStream(tempFilename));
  const file = fs.readFileSync(tempFilename, "utf-8");
  const words = extractWords(file.toString());
  fs.unlinkSync(tempFilename);
  return words;
};

const baseUrl = "https://sites.google.com/site/flexargentina/Home/";
// const baseUrl = 'http://www.redeletras.com/d/'; // alternative url, although contains some numbers

const files = [
  "a1.txt",
  "a2.txt",
  "b.txt",
  "c1.txt",
  "c2.txt",
  "d.txt",
  "de.txt",
  "des1.txt",
  "des2.txt",
  "e1.txt",
  "e2.txt",
  "en.txt",
  "f.txt",
  "g.txt",
  "h.txt",
  "i.txt",
  "j.txt",
  "l.txt",
  "m.txt",
  "n.txt",
  "enie.txt",
  "o.txt",
  "p.txt",
  "q.txt",
  "r.txt",
  "s.txt",
  "t.txt",
  "u.txt",
  "v.txt",
  "x.txt",
  "y.txt",
  "z.txt",
];

async function run() {
  let words = [];

  for (const file of files) {
    const url = baseUrl + file;
    const newWords = await downloadWords(url);
    words = words.concat(newWords);
  }

  const sortedWords = words.sort((a, b) => a.localeCompare(b)).filter(Boolean);
  fs.writeFileSync("fise-2.txt", sortedWords.join("\n"));
}

run();
