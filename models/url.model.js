const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true
    }
});

const ShortUrl = mongoose .model('shortUrl', shortUrlSchema);

module.exports = ShortUrl;