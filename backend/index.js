const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { DBConnection } = require("./database/db");
const User = require("./model/User");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Question } = require('./model/Question');
const {executeCPP} = require('./executeCPP');
const{executeC} = require('./executeC');
const {executeJava} = require('./executeJava');
const { generateFile } = require("./generateFile");






DBConnection();

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if all required fields are present
    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("Please enter all the details");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Save the user into the database
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // Return the response
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

app.post('/add-question', async (req, res) => {
  try {
      const { questionName, difficulty, description, testCaseInput, testCaseOutput } = req.body;

      // Create the question with test cases using Question.create
      const question = await Question.create({
          questionName,
          difficulty,
          description,
          testCases: [{
              input: testCaseInput,
              output: testCaseOutput
          }]
      });

      res.status(201).send("Question and test case added successfully");
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
  }
});

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
    console.error("Token Verification Error:", error); // Log the error
    res.status(400).send("Invalid Token");
  }
};


app.get("/questions", authenticateToken, async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get a specific question by ID
app.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).send("Question not found");
    }
    res.status(200).json(question);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

app.post("/run", async (req, res) => {


  const { language = 'cpp', code } = req.body;
  if (code === undefined) {
      return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
      const filePath = await generateFile(language, code);
      const output = await executeCpp(filePath);
      res.json({ filePath, output });
  } catch (error) {
      res.status(500).json({ error: error });
  }
});

app.post("/submit", async (req, res) => {
  const { language, code, input, questionId } = req.body;

  console.log("Received input for /submit:", req.body); // Logging the input

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
  console.log(`listening on ${process.env.PORT}`);
});


