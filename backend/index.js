const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { DBConnection } = require("./database/db");
const User = require("./model/User");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Question } = require('./model/Question');
const { executeCpp } = require('./executeCPP');
const { generateFile } = require("./generateFile");

dotenv.config();
DBConnection();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).send("Access Denied: No Token Provided");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied: Malformed Token");
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(400).send("Invalid Token");
  }
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("Please enter all the details");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "User successfully created",
      user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("Please enter all the data");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const enteredPassword = await bcrypt.compare(password, user.password);

    if (!enteredPassword) {
      return res.status(400).send("Wrong password");
    }

    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const options = {
      expires: new Date(Date.now() + 12460601000),
      httpOnly: true,
    };

    user.password = undefined;

    res.status(200).cookie("token", token, options).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Add Question
app.post('/questions', async (req, res) => {
  try {
    const { questionName, difficulty, description, testCaseInput, testCaseOutput } = req.body;

    const question = await Question.create({
      questionName,
      difficulty,
      description,
      testCases: [{
        input: testCaseInput,
        output: testCaseOutput
      }]
    });

    res.status(201).json({ message: "Question and test case added successfully", question });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get All Questions
app.get("/questions", authenticateToken, async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

app.put("/questions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { questionName, difficulty, description, testCaseInput, testCaseOutput } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Question ID" });
  }

  try {
    const question = await Question.findByIdAndUpdate(id, {
      questionName,
      difficulty,
      description,
      testCases: [{
        input: testCaseInput,
        output: testCaseOutput
      }]
    }, { new: true });

    if (!question) {
      return res.status(404).send("Question not found");
    }

    res.status(200).json({ message: "Question updated successfully", question });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// GET request handler to fetch a question by ID
app.get("/questions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Question ID" });
  }

  try {
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).send("Question not found");
    }

    res.status(200).json(question);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});


// Delete Question
app.delete("/questions/:id", authenticateToken, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).send("Question not found");
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

app.post("/run", async (req, res) => {
  const { language = 'cpp', code, input = '' } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  try {
    console.log("Received request to run code");
    console.log("Language:", language);
    console.log("Code:", code);
    console.log("Input:", input);

    // Generate file with code
    const filePath = await generateFile(language, code);
    console.log("Generated file at:", filePath);

    // Write user input to a file if provided
    let inputFilePath = null;
    if (input) {
      inputFilePath = await generateInputFile(input);
      console.log("Input file created at:", inputFilePath);
    }

    // Execute the code and generate output
    const output = await executeCpp(filePath, inputFilePath);
    console.log("Execution output:", output);

    res.json({ filePath, output });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to run code", details: error.message });
  }
});


app.post("/submit", async (req, res) => {
  const { language, code, input, questionId } = req.body;

  console.log("Received input for /submit:", req.body);

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const result = await executeCode(language, code, input);

    const passedAllTestCases = question.testCases.every((testCase) => {
      const { stdout } = executeCode(language, code, testCase.input);
      return stdout.trim() === testCase.output.trim();
    });

    res.status(200).json({ output: result.stdout, passedAllTestCases });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});