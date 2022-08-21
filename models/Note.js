const mongoose = require('mongoose')
const { Schema } = mongoose;

const NoteSchema = new Schema({
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Note', NoteSchema)