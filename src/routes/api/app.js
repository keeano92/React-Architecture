import express from 'express'


//Model
import { App } from '../../models/app'

var version = express.Router()


// @route POST api/app/app
// @desc Will post the application information
// @access Public
version.post("/app", (req, res) => {
    App.findOne({version: req.body.version})
        .then(app => {
            if (app) {
                return res.status(400).json({version: "Version already exists, please update and try again."})
            } else {
                const newApp = new App({
                    name: req.body.name,
                    version: req.body.version
                })

                //Save new Version to DB
                newApp
                    .save()
                    .then(app => res.json(app))
                    .catch(err => console.log(err))
            }
        })
})

// @route GET api/app/version
// @desc will post the application information
// @access Public
version.get("/version", (req, res) => {
    App.find().sort('-date').limit(1).find(function(err, data) {
        return res.json(data)
    })
})

export { version }