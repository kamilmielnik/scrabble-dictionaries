const { http, https } = require('follow-redirects');
const fs = require('fs');

const downloadFile = (url, filename) => {
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

const getNextTmpFilename = (() => {
  let tmpFilenameIndex = 0;

  return () => {
    return `tmp-${++tmpFilenameIndex}`;
  };
})();

module.exports = {
  downloadFile,
  getNextTmpFilename,
};
