const express = require( 'express');
const dotenv = require('dotenv');
const cors = require('cors');
const {DBConnection} = require( "./database/db");
const User =  require( "./model/User");
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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
        //ger all the data
        const {firstname, lastname, email, password} = req.body;
        //check if all the data which we get should exist or not
        if(!(firstname && lastname && email && password)){
            res.status(400).send("Please enter all the details");
        }
        //check if the user already exist or not?
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).send("User already exists");
        }
        //encrypting the password
        const hashedPassword = bcrypt.hashSync(password, 10);
        //save the user into db
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        //returning the response
        express.response.status(200).json({
            message: "User Successfully created",
            user,
        });
    } catch (error) {
        console.error(error.message);
    }
});

app.post("/login", async(req, res) => {
    try {
        //get all the data from body
        const {email, password} = req.body;
        //check all the data we get exists or not?
        if(!(email && password)){
            return res.status(400).send("please enter all the data");
        }
        //find the user in the db
        const user = await User.findOne({ email });
        
        if(!user) {
            return res.status(400).send("User not found");
        }
        //match the password
        const enteredPasssword = await bcrypt.compareSync(password, user.password);
        if(!enteredPasssword){
            return res.status(400).send("Wrong password");
        }
        //token
        const token = jwt.sign({id: user._id, email}, process.env.SECRET_KEY,{
            expiresIn: "1h",
        } );
        user.token = token;
        user.password = undefined;
        //store the cookies
        const option = {
            expires: new Date(Date.now()+1*24*60*60*1000),
            httpOnly: true
        }
        //send the token
        res.sendStatus(200).cookie("token", token, option).json({
            message: "User logged in successfully",
            token
        });
    } catch (error) {
        console.error(error.message);
    }
});






app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
})