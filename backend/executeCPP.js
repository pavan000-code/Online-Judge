const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const dirOutputs = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirOutputs)) {
    fs.mkdirSync(dirOutputs, { recursive: true });
}

const executeCpp = (filePath, inputFilePath) => {
    return new Promise((resolve, reject) => {
        const jobID = path.basename(filePath, path.extname(filePath));
        const outputFilename = `${jobID}.txt`;
        const outputFilePath = path.join(dirOutputs, outputFilename);
        const execCommand = inputFilePath 
            ? `g++ ${filePath} -o ${filePath}.out && ./$(dirname ${filePath})/${jobID}.out < ${inputFilePath} > ${outputFilePath}`
            : `g++ ${filePath} -o ${filePath}.out && ./$(dirname ${filePath})/${jobID}.out > ${outputFilePath}`;

        exec(execCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("Error during execution:", error);
                return reject(stderr);
            }
            const output = fs.readFileSync(outputFilePath, 'utf-8');
            resolve(output);
        });
    });
};

module.exports = { executeCpp };
