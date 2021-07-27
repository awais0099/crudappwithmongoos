const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: String,
    email: String,
    phone: String,
});

module.exports = mongoose.model('Student', studentSchema);
