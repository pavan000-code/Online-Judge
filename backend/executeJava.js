const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const classPath = path.join(outputPath, `${jobId}`);
  const inputFilePath = path.join(outputPath, `${jobId}.txt`);

  return new Promise((resolve, reject) => {
    fs.writeFile(inputFilePath, input, (err) => {
      if (err) {
        reject(err);
      }

      exec(
        `javac ${filepath} -d ${outputPath} && java -cp ${outputPath} ${jobId} < ${inputFilePath}`,
        (error, stdout, stderr) => {
          if (error) {
            reject({ error, stderr });
          }
          if (stderr) {
            reject(stderr);
          }
          resolve(stdout);
        }
      );
    });
  });
};

module.exports = { executeJava };
