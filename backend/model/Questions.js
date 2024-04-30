const mongoose = require('mongoose');

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

});

module.exports = mongoose.model("question", questionSchema); 