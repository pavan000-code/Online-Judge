// const mongoose = require('mongoose');

// const questionSchema = new mongoose.Schema({
    
//     questionName: {
//         type: String,
//         required: true,
//         default: null,

//     },
//     difficulty: {
//         type: String,
//         required: true,
//     },

//     code: {
//         type: String,
//         default: null,
//     },

//     description: {
//         type: String,
//         required: true,
//     },

// });

// module.exports = mongoose.model("question", questionSchema); 


const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  questionName: {
    type: String,
    required: true,
    default: null,
  },
  difficulty: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  testCases: [testCaseSchema],
});

const Question = mongoose.model('Question', questionSchema);
const TestCase = mongoose.model('TestCase', testCaseSchema);

// Export models
module.exports = { Question, TestCase };
