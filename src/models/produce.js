import mongoose from 'mongoose'

const produceSchema = new mongoose.Schema({
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'farms'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    measurement: {
        type: String,
        required: false
    },
    sku: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const Produce = mongoose.model('produce', produceSchema);
