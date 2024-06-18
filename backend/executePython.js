const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const inputFilePath = path.join(outputPath, `${jobId}.txt`);

  return new Promise((resolve, reject) => {
    fs.writeFile(inputFilePath, input, (err) => {
      if (err) {
        reject(err);
      }

      exec(`python ${filepath} < ${inputFilePath}`, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      });
    });
  });
};

module.exports = { executePython };
