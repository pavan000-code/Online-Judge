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

const executeJava = (code, input) => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const inputFilePath = path.join(inputDir, `${jobId}.txt`);
    const outputFilePath = path.join(outputDir, `${jobId}.out`);
    const codeFilePath = path.join(outputDir, `${jobId}.java`);
    const className = `Main${jobId}`;
    const classFilePath = path.join(outputDir, `${className}.class`);

    fs.writeFileSync(inputFilePath, input);
    fs.writeFileSync(
      codeFilePath,
      code.replace(/class\s+Main\b/, `class ${className}`)
    );

    exec(
      `javac ${codeFilePath} -d ${outputDir} && java -cp ${outputDir} ${className} < ${inputFilePath} > ${outputFilePath}`,
      (error, stdout, stderr) => {
        if (error) {
          return reject({ error, stderr });
        }

        const output = fs.readFileSync(outputFilePath, "utf-8");
        resolve({ stdout: output });

        // Clean up files
        fs.unlinkSync(inputFilePath);
        fs.unlinkSync(outputFilePath);
        fs.unlinkSync(codeFilePath);
        fs.unlinkSync(classFilePath);
      }
    );
  });
};

module.exports = { executeJava };
