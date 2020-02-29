import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import webpack from 'webpack'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import OneSignal from 'onesignal-node'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config'
var passport = require("passport")

//APi Imports
import { users } from "../routes/api/users";
import { version } from "../routes/api/app";
import { farms } from "../routes/api/farm"; 


const __dirname = './dist/';
const db = require("../config/keys").mongoURI;
const _userAuthKey = require("../config/keys").userAuthKey;
const _appAuthKey = require("../config/keys").appAuthKey;
const _appId = require("../config/keys").appId;

//Setup Database
mongoose.connect(db, { useNewUrlParser: true, autoIndex: false })
.then(() => console.log("MongoDB Successfully Connected"))
.catch(err => console.log(err));

//OneSignal Client
var notificationClient = new OneSignal.Client({
    userAuthKey: _userAuthKey,
    app: { appAuthKey: _appAuthKey, appId: _appId}
})


const app = express(),
           compiler = webpack(config) 
          
//Development Only Middleware
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

//Cookie Parser Middleware
app.use(cookieParser())
//Passport middleware
require("../config/passport")
app.use(passport.initialize())
//Request middleware
app.use(bodyParser())

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`***Server running on Port:${PORT}***`)
})

//Igedla API Routes
app.use('/api/users', users)
app.use('/api/app', version)
app.use('/api/farm', farms)


app.all('*', (req, res) => {
    res.sendFile('/index.html', { root: __dirname })
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