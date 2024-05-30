const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const inputDir = path.join(__dirname, "input");
const outputDir = path.join(__dirname, "output");

// Ensure input and output directories exist
if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const executeC = (code, input) => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const inputFilePath = path.join(inputDir, `${jobId}.txt`);
    const outputFilePath = path.join(outputDir, `${jobId}.out`);
    const codeFilePath = path.join(outputDir, `${jobId}.c`);
    const executablePath = path.join(outputDir, jobId);

    fs.writeFileSync(inputFilePath, input);
    fs.writeFileSync(codeFilePath, code);

    exec(`gcc ${codeFilePath} -o ${executablePath} && ${executablePath} < ${inputFilePath} > ${outputFilePath}`, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stderr });
      }

      const output = fs.readFileSync(outputFilePath, "utf-8");
      resolve({ stdout: output });

      // Clean up files
      fs.unlinkSync(inputFilePath);
      fs.unlinkSync(outputFilePath);
      fs.unlinkSync(codeFilePath);
      fs.unlinkSync(executablePath);
    });
  });
};

module.exports = { executeC };
