const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    action: { type: String, required: true }, 
    message: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now } 
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;