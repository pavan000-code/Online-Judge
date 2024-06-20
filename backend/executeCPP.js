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

const executeCpp = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const jobID = path.basename(filePath, ".cpp");
    const compiledFilePath = path.join(path.dirname(filePath), `${jobID}.out`);
    const outputFilename = `${jobID}.txt`;
    const outputFilePath = path.join(outputDir, outputFilename);

    const compileCommand = `/usr/bin/g++ ${filePath} -o ${compiledFilePath}`;
    const execCommand = inputFilePath
      ? `${compiledFilePath} < ${inputFilePath} > ${outputFilePath}`
      : `${compiledFilePath} > ${outputFilePath}`;

    exec(compileCommand, (compileError, stdout, stderr) => {
      if (compileError) {
        console.error("Error during compilation:", compileError);
        return reject(stderr);
      }

      exec(execCommand, (execError, stdout, stderr) => {
        if (execError) {
          console.error("Error during execution:", execError);
          return reject(stderr);
        }

        const output = fs.readFileSync(outputFilePath, "utf-8");
        resolve(output);
      });
    });
  });
};

module.exports = { executeCpp };
