const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
    const jobID = uuid();
    const filename = `${jobID}.${format}`;
    const filePath = path.join(dirCodes, filename);
    try {
        await fs.promises.writeFile(filePath, content);
        console.log(`Code file written at ${filePath}`);
    } catch (error) {
        console.error(`Error writing code file: ${error}`);
        throw error;
    }
    return filePath;
};

module.exports = {
    generateFile,
};
