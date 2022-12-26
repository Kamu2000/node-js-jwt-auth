const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenKey:{
        type: String,
        required: true
    }

});

module.exports = mongoose.model('refToken', tokenSchema);