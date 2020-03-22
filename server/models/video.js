const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const VideoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: false,
    },
    videoID: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    createdAt:  {
        type: Date,
        default: Date.now,
    },
});

VideoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Video', VideoSchema);