import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    _farmId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'farm'
    },
    title: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    stars:{
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true, 
        default: Date.now,
        expires: 43200
    }
})

export const Review = mongoose.model('review', reviewSchema);