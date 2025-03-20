const { http, https } = require('follow-redirects');
const fs = require('fs');
const unzipper = require('unzipper');

const downloadFile = (url) => {
  const filename = getNextTmpFilename();

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const writeStream = fs.createWriteStream(filename);
    const request = protocol.get(url, (response) => {
      if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
        reject(new Error(`Cannot download file: ${url}`));
        return;
      }

      response.on('error', (error) => {
        writeStream.close();
        reject(error);
      });

      response.on('end', () => {
        writeStream.on('finish', () => {
          writeStream.close();
          resolve(filename);
        });
      });

      response.pipe(writeStream);
    });

    request.on('error', (error) => {
      writeStream.close();
      reject(error);
    });
  });
};

const extractWords = (file) => {
  const lines = file.toLocaleLowerCase().split(/\r?\n/g);
  const words = lines
    .map((word) => word.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const uniqueWords = Array.from(new Set(words));
  const output = uniqueWords.join('\n');

  return output;
};

const getNextTmpFilename = (() => {
  let tmpFilenameIndex = 0;

  return () => {
    return `tmp-${++tmpFilenameIndex}`;
  };
})();

const unzipFiles = (filename, onEntry) => {
  return fs.createReadStream(filename).pipe(unzipper.Parse()).on('entry', onEntry).promise();
};

const unzipFile = async (filename, zippedFilename) => {
  const tmpFilename = getNextTmpFilename();

  await unzipFiles(filename, (entry) => {
    if (entry.path === zippedFilename) {
      entry.pipe(fs.createWriteStream(tmpFilename));
    } else {
      entry.autodrain();
    }
  });

  const file = fs.readFileSync(tmpFilename, 'utf-8');

  fs.unlinkSync(tmpFilename);

  return file;
};

module.exports = {
  downloadFile,
  extractWords,
  getNextTmpFilename,
  unzipFile,
  unzipFiles,
};
