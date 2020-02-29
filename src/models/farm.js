import mongoose from 'mongoose'

const farmSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    farmName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    farmerType: {
        type: String,
        required: true
    },
    location: {
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const Farm = mongoose.model('farms', farmSchema)