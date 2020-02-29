import mongoose from 'mongoose'

const appShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const App = mongoose.model('app', appShema);