const express = require( 'express');
const dotenv = require('dotenv');
const cors = require('cors');
const {DBConnection} = require( "./database/db");
const User =  require( "./model/User");
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Questions = require("./model/Questions");

DBConnection();

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req,res) => {
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

app.post('/new-question', async(req, res) => {
    try {
        // create a question or get the question from body/frontend:
    const { questionName, difficulty, code, description } = req.body;

    if(!(questionName && difficulty && code && description)) {
        res.status(400).send("please enter all the details");
    }
    const existingQuestion = await Questions.findOne({ questionName});
    if(existingQuestion){
        res.status(400).send("Question already exists");
    }

    //save that question in the database
    const question = await Questions.create({
        questionName,
        difficulty,
        code,
        description,
    });
    res.status(200).send("question created successfully");
    //print the question.
    console.log(question);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/get-questions', async (req, res) => {
    try {
        const question = await Questions.find();
        res.json(question);
    } catch (error) {
        console.error(error.message);
    }
})








app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
})