import mongoose from 'mongoose'

const farmProfileSchema = new mongoose.Schema({
    farmer: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    farm:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'farms'
    },
    displayName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    hours: {
        monOpen:{
            type: String
        },
        monClose:{
            type: String
        },
        tuesOpen:{
            type: String
        },
        tuesClose:{
            type: String
        },
        wedOpen: {
            type: String
        },
        wedClose: {
            type: String
        },
        thurOpen: {
            type: String
        },
        thurClose: {
            type: String
        },
        friOpen: {
            type: String
        },
        friClose: {
            type: String
        },
        satOpen: {
            type: String
        },
        satClose: {
            type: String
        },
        sunOpen:{
            type: String
        },
        sunClose:{
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const FarmProfile = mongoose.model('profiles', farmProfileSchema)