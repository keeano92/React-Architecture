import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import OneSignal from 'onesignal-node'
import bodyParser from 'body-parser'
var passport = require("passport")

//APi Imports
import { users } from "../routes/api/users";
import { version } from "../routes/api/app";
import { farms } from "../routes/api/farm";

const __dirname = './dist/';
// const db = require("../config/keys").mongoURI;
import { mongoURI } from '../config/keys'
const _userAuthKey = require("../config/keys").userAuthKey;
const _appAuthKey = require("../config/keys").appAuthKey;
const _appId = require("../config/keys").appId;

//Setup Database
mongoose.connect(mongoURI, { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Successfully Connected"))
    .catch(err => console.log(err));

const app = express()

app.use(express.static(__dirname))

//Cookie Parser Middleware
app.use(cookieParser())
//Passport Middleware
require("../config/passport")
app.use(passport.initialize())
//Request middleware
app.use(bodyParser())

//OneSignal Client
var notificationClient = new OneSignal.Client({
    userAuthKey: _userAuthKey,
    app: { appAuthKey: _appAuthKey, appId: _appId }
})


//Igedla API Routes
app.use('/api/users', users)
app.use('/api/app', version)
app.use('/api/farm', farms)


app.all('*', (req, res) => {
    res.sendFile('/index.html', { root: __dirname })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`***Server running on Port:${PORT}***`)
})



//OneSignal Test Function
function testNotification() {
    var test = new OneSignal.Notification({
        contents: {
            en: "Test Notification",
            tr: "Test masaji"
        },
        include_segments: ["Active Users", "Inactive Users"]
    })

    notificationClient.sendNotification(test)
        .then((response) => {
            console.log(response.data, response.httpResponse.statusCode)
        })
        .catch((err) => {
            console.log('Something went wrong...', err)
        })
}