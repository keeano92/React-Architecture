import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import mailer from 'nodemailer'
import transport from 'nodemailer-sendgrid-transport'
import keys from '../../config/keys'
import { addZeros } from '../../utils/setAuthToken'

const stripe = require("stripe")("sk_test_gb2y4PNud1OYctfbVOwzRfTB00rPNCdwjO")
require('babel-polyfill')

//Validation
import { validateRegistrationInput } from '../../validation/register'
import { validateLoginInput } from '../../validation/login'
// import { validateForgotPassword } from '../../validation/forgot_password'

//Model
import { User } from '../../models/user'
import { Token } from '../../models/token'
import { Farm } from '../../models/farm'
import { FarmProfile } from '../../models/farmProfile'
import { Produce } from '../../models/produce'

//Create Email Transport to be used Globally
const transporter = mailer.createTransport(
    transport({
        auth: {
            api_key: keys.sendgridKey
        }
    })
)

var users = express.Router()

// @route POST api/users.register
// @desc Register user
// @access Public
users.post("/register", (req, res) => {
    const { errors, isValid } = validateRegistrationInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    //Check against email if user exists
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "Email already exists" })
            } else {
                const newUser = new User({
                    name: req.body.name,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    isFarmer: req.body.isFarmer,
                    isLegalVerified: req.body.isLegalVerified,
                    password: req.body.password
                })

                //Hash the Password before DB Peristance
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.json(user)
                            })
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

// @route POST api/users/updateAccount
// @desc Update user account info
// @access Public
users.post("/updateAccount", (req, res) => {
    User.findOneAndUpdate({ email: req.body.email }, {
        $set: {
            name: req.body.name,
            email: req.body.email
        }
    },
        { new: true }, (err, user) => {
            if (err) {
                res.json(err)
            }
            res.json("User has updated Account, User: " + JSON.stringify(user));
        })
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
users.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email
    const password = req.body.password
    //Setup Payload for user dashbaord
    const payload = {
        user: {
            id: "",
            name: "",
            email: ""
        },
        token: "",
        isFarmer: "",
        needsFarm: "",
        success: false,
        farms: [],
        produce: [],
        reviews: [],
        profiles: []
    }
    //Find user by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ emailnotfound: "Email not found" })
            }
            console.log(JSON.stringify(user))

            //Set User Details
            payload.user.id = user.id
            payload.user.name = user.name
            payload.user.email = user.email
            payload.user.isFarmer = user.isFarmer
            payload.user.needsFarm = user.needsFarm


            //Verify Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //Sign Token
                        jwt.sign(payload.user, keys.secretOrKey,
                            {
                                expiresIn: 31556926 //1 year
                            },
                            (err, token) => {
                                //Get Farms
                                Farm.find({}, function (err, farms) {
                                    farms.forEach(function (farm) {
                                        payload.farms.push(farm)
                                    })

                                    FarmProfile.find({}, function (err, profiles) {
                                        profiles.forEach(function (profile) {
                                            payload.profiles.push(profile)
                                        })

                                        Produce.find({}, function (err, produce) {
                                            produce.forEach(function (item) {
                                                payload.produce.push(item)
                                            })

                                            //Set Payload
                                            payload.success = true
                                            payload.token = "Bearer " + token


                                            res.json(payload)
                                        })
                                    })
                                })
                            })
                    } else {
                        return res
                            .status(400)
                            .json({ passwordincorrect: "Password incorrect" })
                    }
                })
        })
})

// @route POST api/users/guestLogin
// @desc Guest Login users
// @access Public
users.post("/guestLogin", (req, res) => {
    //ToDo: Add Validation so no tamper

    //Setup Payload for GuestUser
    const email = "Guest@FarmEstar.com"
    const password = "GuestUser"
    const payload = {
        user: {
            id: "",
            name: "",
            email: ""
        },
        token: "",
        isFarmer: "",
        success: false,
        farms: [],
        produce: [],
        reviews: [],
        profiles: []
    }

    //Find and Map Guest User
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ emailnotfound: "Guest User Not Applicable, Please create a profile or try again later." })
            }

            //Set Guest Details
            payload.user.id = user.id
            payload.user.name = user.name
            payload.user.email = user.email
            payload.user.isFarmer = user.isFarmer

            //Tokenization for use tracking
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //Sign Token
                        jwt.sign(payload.user, keys.secretOrKey,
                            {
                                expiresIn: 31556926
                            },
                            (err, token) => {
                                //Get Farms
                                Farm.find({}, function (err, farms) {
                                    farms.forEach(function (farm) {
                                        payload.farms.push(farm)
                                    })

                                    FarmProfile.find({}, function (err, profiles) {
                                        profiles.forEach(function (profile) {
                                            payload.profiles.push(profile)
                                        })

                                        Produce.find({}, function (err, produce) {
                                            produce.forEach(function (item) {
                                                payload.produce.push(item)
                                            })

                                            //Set Payload
                                            payload.success = true
                                            payload.token = "Bearer " + token


                                            res.json(payload)
                                        })
                                    })
                                })
                            })
                    } else {
                        return res
                            .status(400)
                            .json({ passwordincorrect: "Password error for guest login" })
                    }
                })
        })
})

// @route POST api/users/forgotPassword
// @desc Request a token to reset password
// @access Public
users.post("/forgotPassword", (req, res) => {
    //Check User Exists
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                //Create verification token for user
                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })

                //Save Token
                token.save()
                //Send email with verify token
                const options = {
                    to: user.email,
                    from: 'admin@farmestar.com',
                    subject: 'FarmEstar, Reset Password',
                    html: 'Hello,\n\n' + 'We have been notified that you requested to reset your password. Please do so following this url: \nhttp:\/\/' + req.headers.host + '\/updatePassword\/' + token.token + '.\n',
                }
                transporter.sendMail(options, (err, resp) => {
                    if (err) {
                        console.log(err.message)
                    } else {
                        console.log('A verification email has been sent to ' + user.email + '.')
                    }
                })
                res.json(user)
            } else {
                //User Error
                return res.status(400).json({ email: "Email does not exist" })
            }
        })
})

// @route POST api/users/updatePassword
// @desc Verify Token and Reset Password
// @access Public
users.post("/updatePassword", (req, res) => {
    // const { errors, isValid } = validateForgotPassword(req.body)

    //Check Validation
    // if (!isValid) {
    //     return res.status(400).json(errors)
    // }

    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) {
            return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' })
        } else {
            //Hash Password before persisting back to DB
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    User.findOneAndUpdate({ email: req.body.email }, { $set: { password: hash } }, { new: true }, (err, user) => {
                        if (err) {
                            res.json(err)
                        }
                        res.json("User has updated passwor, User: " + JSON.stringify(user));
                    })
                })
            })
        }

    })
})

// @route POST api/users/charge
// @desc Make chare to stripe
// @Access Private
users.post("/charge", async (req, res) => {
    const stripeChargeCallback = res => (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).send({ error: stripeErr });
        } else {
            res.status(200).send({ success: stripeRes });
        }
    }

    const amountString = addZeros(req.body.total.toString())
    const amount = parseFloat(parseFloat(amountString).toFixed(2))
    const _amount = amount * 100

    //Create Description
    const _description = chargeDescription(req.body.cart)

    const payload = {
        amount: _amount,
        currency: "usd",
        description: _description,
        source: req.body.tokenId
    }

    console.log("Backend Payload: " + JSON.stringify(payload))

    stripe.charges.create(payload, stripeChargeCallback(res))
})

// @route GET api/users/dashboard
// @desc Get the Farms and Reviews for Dashboard
// @access Public
users.get("/dashboard", (req, res) => {
    var payload = {
        farms: [],
        reviews: []
    }

    //Get Farms
    Farm.find({}, function (err, farms) {
        farms.forEach(function (farm) {
            payload.farms.push(farm)
        })
        res.send(payload)
    })
})


// @route GET api/users/setPhonenumber
// @desc Set the users phone number for UIX
// @access Public
users.post("/setPhoneNumber", (req, res) => {
    // console.log(JSON.stringify(req))
    User.findOneAndUpdate({ email: req.body.email },
        {
            $set: {
                phone: req.body.phonenumber
            }
        },
        { new: true }, (err, user) => {
            if (err) {
                res.json(err)
            }
            res.json("User has updated Phone, User: " + JSON.stringify(user));
        })
})

// @route GET api/users/sendFarmerEmail
// @desc Set the users phone number for UIX
// @access Public
users.post("/sendFarmerEmail", (req, res) => {
    res.json({ message: "Hit farmer email send" })
    //Build Object for Farmer Email
    //Iterate over Cart items, place in email
    //Place Total
    //Users Phonenumber who placed the order
    //Send Email via SendGrid
    User.findById(req.body.farmer)
        .then(user => {
            const options = {
                to: user.email,
                cc: ['admin@farmestar.com', 'keeano92@gmail.com'],
                from: 'admin@farmestar.com',
                subject: 'FarmEstar, Purchase',
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <title></title> <!--[if !mso]><!--> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!--<![endif]--> <meta name="viewport" content="width=device-width" /> <style type="text/css"> @media only screen and (min-width: 620px) { .wrapper { min-width: 600px !important } .wrapper h1 {} .wrapper h1 { font-size: 36px !important; line-height: 43px !important } .wrapper h2 {} .wrapper h2 { font-size: 20px !important; line-height: 28px !important } .wrapper h3 {} .column {} .wrapper .size-8 { font-size: 8px !important; line-height: 14px !important } .wrapper .size-9 { font-size: 9px !important; line-height: 16px !important } .wrapper .size-10 { font-size: 10px !important; line-height: 18px !important } .wrapper .size-11 { font-size: 11px !important; line-height: 19px !important } .wrapper .size-12 { font-size: 12px !important; line-height: 19px !important } .wrapper .size-13 { font-size: 13px !important; line-height: 21px !important } .wrapper .size-14 { font-size: 14px !important; line-height: 21px !important } .wrapper .size-15 { font-size: 15px !important; line-height: 23px !important } .wrapper .size-16 { font-size: 16px !important; line-height: 24px !important } .wrapper .size-17 { font-size: 17px !important; line-height: 26px !important } .wrapper .size-18 { font-size: 18px !important; line-height: 26px !important } .wrapper .size-20 { font-size: 20px !important; line-height: 28px !important } .wrapper .size-22 { font-size: 22px !important; line-height: 31px !important } .wrapper .size-24 { font-size: 24px !important; line-height: 32px !important } .wrapper .size-26 { font-size: 26px !important; line-height: 34px !important } .wrapper .size-28 { font-size: 28px !important; line-height: 36px !important } .wrapper .size-30 { font-size: 30px !important; line-height: 38px !important } .wrapper .size-32 { font-size: 32px !important; line-height: 40px !important } .wrapper .size-34 { font-size: 34px !important; line-height: 43px !important } .wrapper .size-36 { font-size: 36px !important; line-height: 43px !important } .wrapper .size-40 { font-size: 40px !important; line-height: 47px !important } .wrapper .size-44 { font-size: 44px !important; line-height: 50px !important } .wrapper .size-48 { font-size: 48px !important; line-height: 54px !important } .wrapper .size-56 { font-size: 56px !important; line-height: 60px !important } .wrapper .size-64 { font-size: 64px !important; line-height: 63px !important } } </style> <meta name="x-apple-disable-message-reformatting" /> <style type="text/css"> body { margin: 0; padding: 0; } table { border-collapse: collapse; table-layout: fixed; } * { line-height: inherit; } [x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; } .wrapper .footer__share-button a:hover, .wrapper .footer__share-button a:focus { color: #ffffff !important; } .btn a:hover, .btn a:focus, .footer__share-button a:hover, .footer__share-button a:focus, .email-footer__links a:hover, .email-footer__links a:focus { opacity: 0.8; } .preheader, .header, .layout, .column { transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out; } .preheader td { padding-bottom: 8px; } .layout, div.header { max-width: 400px !important; -fallback-width: 95% !important; width: calc(100% - 20px) !important; } div.preheader { max-width: 360px !important; -fallback-width: 90% !important; width: calc(100% - 60px) !important; } .snippet, .webversion { Float: none !important; } .stack .column { max-width: 400px !important; width: 100% !important; } .fixed-width.has-border { max-width: 402px !important; } .fixed-width.has-border .layout__inner { box-sizing: border-box; } .snippet, .webversion { width: 50% !important; } .ie .btn { width: 100%; } .ie .stack .column, .ie .stack .gutter { display: table-cell; float: none !important; } .ie div.preheader, .ie .email-footer { max-width: 560px !important; width: 560px !important; } .ie .snippet, .ie .webversion { width: 280px !important; } .ie div.header, .ie .layout { max-width: 600px !important; width: 600px !important; } .ie .two-col .column { max-width: 300px !important; width: 300px !important; } .ie .three-col .column, .ie .narrow { max-width: 200px !important; width: 200px !important; } .ie .wide { width: 400px !important; } .ie .stack.fixed-width.has-border, .ie .stack.has-gutter.has-border { max-width: 602px !important; width: 602px !important; } .ie .stack.two-col.has-gutter .column { max-width: 290px !important; width: 290px !important; } .ie .stack.three-col.has-gutter .column, .ie .stack.has-gutter .narrow { max-width: 188px !important; width: 188px !important; } .ie .stack.has-gutter .wide { max-width: 394px !important; width: 394px !important; } .ie .stack.two-col.has-gutter.has-border .column { max-width: 292px !important; width: 292px !important; } .ie .stack.three-col.has-gutter.has-border .column, .ie .stack.has-gutter.has-border .narrow { max-width: 190px !important; width: 190px !important; } .ie .stack.has-gutter.has-border .wide { max-width: 396px !important; width: 396px !important; } .ie .fixed-width .layout__inner { border-left: 0 none white !important; border-right: 0 none white !important; } .ie .layout__edges { display: none; } .mso .layout__edges { font-size: 0; } .layout-fixed-width, .mso .layout-full-width { background-color: #ffffff; } @media only screen and (min-width: 620px) { .column, .gutter { display: table-cell; Float: none !important; vertical-align: top; } div.preheader, .email-footer { max-width: 560px !important; width: 560px !important; } .snippet, .webversion { width: 280px !important; } div.header, .layout, .one-col .column { max-width: 600px !important; width: 600px !important; } .fixed-width.has-border, .fixed-width.x_has-border, .has-gutter.has-border, .has-gutter.x_has-border { max-width: 602px !important; width: 602px !important; } .two-col .column { max-width: 300px !important; width: 300px !important; } .three-col .column, .column.narrow, .column.x_narrow { max-width: 200px !important; width: 200px !important; } .column.wide, .column.x_wide { width: 400px !important; } .two-col.has-gutter .column, .two-col.x_has-gutter .column { max-width: 290px !important; width: 290px !important; } .three-col.has-gutter .column, .three-col.x_has-gutter .column, .has-gutter .narrow { max-width: 188px !important; width: 188px !important; } .has-gutter .wide { max-width: 394px !important; width: 394px !important; } .two-col.has-gutter.has-border .column, .two-col.x_has-gutter.x_has-border .column { max-width: 292px !important; width: 292px !important; } .three-col.has-gutter.has-border .column, .three-col.x_has-gutter.x_has-border .column, .has-gutter.has-border .narrow, .has-gutter.x_has-border .narrow { max-width: 190px !important; width: 190px !important; } .has-gutter.has-border .wide, .has-gutter.x_has-border .wide { max-width: 396px !important; width: 396px !important; } } @supports (display: flex) { @media only screen and (min-width: 620px) { .fixed-width.has-border .layout__inner { display: flex !important; } } } @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) { .fblike { background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important; } .tweet { background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important; } .linkedinshare { background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important; } .forwardtoafriend { background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important; } } @media (max-width: 321px) { .fixed-width.has-border .layout__inner { border-width: 1px 0 !important; } .layout, .stack .column { min-width: 320px !important; width: 320px !important; } .border { display: none; } .has-gutter .border { display: table-cell; } } .mso div { border: 0 none white !important; } .mso .w560 .divider { Margin-left: 260px !important; Margin-right: 260px !important; } .mso .w360 .divider { Margin-left: 160px !important; Margin-right: 160px !important; } .mso .w260 .divider { Margin-left: 110px !important; Margin-right: 110px !important; } .mso .w160 .divider { Margin-left: 60px !important; Margin-right: 60px !important; } .mso .w354 .divider { Margin-left: 157px !important; Margin-right: 157px !important; } .mso .w250 .divider { Margin-left: 105px !important; Margin-right: 105px !important; } .mso .w148 .divider { Margin-left: 54px !important; Margin-right: 54px !important; } .mso .size-8, .ie .size-8 { font-size: 8px !important; line-height: 14px !important; } .mso .size-9, .ie .size-9 { font-size: 9px !important; line-height: 16px !important; } .mso .size-10, .ie .size-10 { font-size: 10px !important; line-height: 18px !important; } .mso .size-11, .ie .size-11 { font-size: 11px !important; line-height: 19px !important; } .mso .size-12, .ie .size-12 { font-size: 12px !important; line-height: 19px !important; } .mso .size-13, .ie .size-13 { font-size: 13px !important; line-height: 21px !important; } .mso .size-14, .ie .size-14 { font-size: 14px !important; line-height: 21px !important; } .mso .size-15, .ie .size-15 { font-size: 15px !important; line-height: 23px !important; } .mso .size-16, .ie .size-16 { font-size: 16px !important; line-height: 24px !important; } .mso .size-17, .ie .size-17 { font-size: 17px !important; line-height: 26px !important; } .mso .size-18, .ie .size-18 { font-size: 18px !important; line-height: 26px !important; } .mso .size-20, .ie .size-20 { font-size: 20px !important; line-height: 28px !important; } .mso .size-22, .ie .size-22 { font-size: 22px !important; line-height: 31px !important; } .mso .size-24, .ie .size-24 { font-size: 24px !important; line-height: 32px !important; } .mso .size-26, .ie .size-26 { font-size: 26px !important; line-height: 34px !important; } .mso .size-28, .ie .size-28 { font-size: 28px !important; line-height: 36px !important; } .mso .size-30, .ie .size-30 { font-size: 30px !important; line-height: 38px !important; } .mso .size-32, .ie .size-32 { font-size: 32px !important; line-height: 40px !important; } .mso .size-34, .ie .size-34 { font-size: 34px !important; line-height: 43px !important; } .mso .size-36, .ie .size-36 { font-size: 36px !important; line-height: 43px !important; } .mso .size-40, .ie .size-40 { font-size: 40px !important; line-height: 47px !important; } .mso .size-44, .ie .size-44 { font-size: 44px !important; line-height: 50px !important; } .mso .size-48, .ie .size-48 { font-size: 48px !important; line-height: 54px !important; } .mso .size-56, .ie .size-56 { font-size: 56px !important; line-height: 60px !important; } .mso .size-64, .ie .size-64 { font-size: 64px !important; line-height: 63px !important; } </style> <!--[if !mso]><!--> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Roboto:400,700,400italic,700italic); </style> <link href="https://fonts.googleapis.com/css?family=Roboto:400,700,400italic,700italic" rel="stylesheet" type="text/css" /> <!--<![endif]--> <style type="text/css"> body { background-color: #fff } .logo a:hover, .logo a:focus { color: #859bb1 !important } .mso .layout-has-border { border-top: 1px solid #ccc; border-bottom: 1px solid #ccc } .mso .layout-has-bottom-border { border-bottom: 1px solid #ccc } .mso .border, .ie .border { background-color: #ccc } .mso h1, .ie h1 {} .mso h1, .ie h1 { font-size: 36px !important; line-height: 43px !important } .mso h2, .ie h2 {} .mso h2, .ie h2 { font-size: 20px !important; line-height: 28px !important } .mso h3, .ie h3 {} .mso .layout__inner, .ie .layout__inner {} .mso .footer__share-button p {} .mso .footer__share-button p { font-family: Avenir, sans-serif } </style> <meta name="robots" content="noindex,nofollow" /> <meta property="og:title" content="My First Campaign" /></head><!--[if mso]> <body class="mso"><![endif]--><!--[if !mso]><!--><body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"> <!--<![endif]--> <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"> <tbody> <tr> <td> <div role="banner"> <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"> <div style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]--> <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #969da3;font-family: Avenir,sans-serif;"> </div> <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]--> <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #969da3;font-family: Avenir,sans-serif;"> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container"> <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]--> <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center"> <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 227px;" src="https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/Asset24x.png?alt=media&token=9acb19df-4eb1-4f0d-bf93-694b3c7dcbd8" alt="" width="227" /></div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> <div> <div style="background-color: #373635;background: 65% 45%/auto auto no-repeat url(https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/agriculture-arable-barley-blur-265216.jpg?alt=media&token=9e8dafa8-3925-473b-bed4-2665c591b18b) #373635;background-position: 65% 45%;background-image: url(https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/agriculture-arable-barley-blur-265216.jpg?alt=media&token=9e8dafa8-3925-473b-bed4-2665c591b18b);background-repeat: no-repeat;background-size: auto auto;"> <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 65% 45%/auto auto no-repeat url(https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/agriculture-arable-barley-blur-265216.jpg?alt=media&token=9e8dafa8-3925-473b-bed4-2665c591b18b);background-repeat: no-repeat;background-size: auto auto;background-color: #373635;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]--> <div class="column" style="text-align: left;color: #5d5d5d;font-size: 14px;line-height: 21px;font-family: Roboto,Tahoma,sans-serif;"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div> </div> <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center"> <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #9f1b32;" href="https://www.farmestar.com/"><img style="border: 0;display: block;height: auto;width: 100%;max-width: 82px;" alt="" width="82" src="https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/Asset%203%404x.png?alt=media&token=b0037218-3e87-432f-8b71-ae5eb839394c" /></a> </div> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;Margin-bottom: 24px;"> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div> </div> </div> <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]--> </div> </div> </div> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div> <div style="background-color: #ffffff;"> <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #ffffff;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]--> <div class="column" style="text-align: left;color: #5d5d5d;font-size: 14px;line-height: 21px;font-family: Roboto,Tahoma,sans-serif;"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"> <h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #9f1b32;font-size: 30px;line-height: 38px;text-align: center;"> <strong>A Purchase Has Been Made!</strong></h1> <h3 style="Margin-top: 20px;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #a3a3a3;font-size: 16px;line-height: 24px;text-align: center;"> Please use the below information to prepare your customers order.</h3> </div> </div> <div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div> </div> <div style="Margin-left: 20px;Margin-right: 20px;"> <div class="divider" style="display: block;font-size: 2px;line-height: 2px;Margin-left: auto;Margin-right: auto;width: 40px;background-color: #ccc;Margin-bottom: 20px;"> &nbsp;</div> </div> <div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div> </div> <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;"> <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"> <p style="Margin-top: 0;Margin-bottom: 0;">Here at FarmEstar we value customer service just as much as you. If there is anything we can do please reach us here: <a href="mailto:Admin@farmestar.com">Admin@farmestar.com</a>&nbsp;&nbsp; If there is an error on this order and you need to contact the customer please do so at their number provided for this order: <a href="tel:${req.body.transactionData.phone}">${req.body.transactionData.phone}</p></a> <p style="Margin-top: 20px;Margin-bottom: 0;"> ORDER DETAILS:</p> <p style="Margin-top: 20px;Margin-bottom: 0;"> Customer Name: ${req.body.transactionData.name}</p> ${iterateItems(req.body.transactionData.cart)} <p style="Margin-top: 20px;Margin-bottom: 0;"> Total: $ ${req.body.farmersTotal}.00</p> <p style="Margin-top: 20px;Margin-bottom: 0;"> Transaction Id: ${req.body.transactionData.transactionID}</p> <p style="Margin-top: 20px;Margin-bottom: 0;"> Transaction Receipt: ${req.body.transactionData.receipt_url}</p> <p style="Margin-top: 20px;Margin-bottom: 0;">&nbsp;</p> </div> </div> </div> <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]--> </div> </div> </div> <div role="contentinfo"> <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]--> <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #969da3;font-family: Avenir,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div style="font-size: 12px;line-height: 19px;"> <div>FarmEstar<br /> &nbsp;</div> </div> <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;"> <div>You are receiving this email because you made a purchase through the FarmEstar app. If you did not make this purchase please contact support.</div> </div> <!--[if mso]>&nbsp;<![endif]--> </div> </div> <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]--> <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #969da3;font-family: Avenir,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> </div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]--> <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #969da3;font-family: Avenir,sans-serif;"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div style="font-size: 12px;line-height: 19px;"> <unsubscribe style="text-decoration: underline;">Unsubscribe</unsubscribe> </div> </div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> </div> <div style="line-height:40px;font-size:40px;">&nbsp;</div> </div> </td> </tr> </tbody> </table></body></html>`
            }
            transporter.sendMail(options, (err, resp) => {
                if (err) {
                    console.log(err.message)
                } else {
                    console.log('A confirmation email has been sent to ' + user.email + '.')

                }
            })

        })
})

// @route GET api/users/setPhonenumber
// @desc Set the users phone number for UIX
// @access Public
users.post("/sendConsumerEmail", (req, res) => {
    res.json(JSON.stringify(req.body.farmerTotal))
    const options = {
        to: req.body.transactionData.email,
        from: 'admin@farmestar.com',
        subject: 'FarmEstar, Purchase',
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <title></title> <!--[if !mso]><!--> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!--<![endif]--> <meta name="viewport" content="width=device-width" /> <style type="text/css"> @media only screen and (min-width: 620px) { .wrapper { min-width: 600px !important } .wrapper h1 {} .wrapper h1 { font-size: 36px !important; line-height: 43px !important } .wrapper h2 {} .wrapper h2 { font-size: 20px !important; line-height: 28px !important } .wrapper h3 {} .column {} .wrapper .size-8 { font-size: 8px !important; line-height: 14px !important } .wrapper .size-9 { font-size: 9px !important; line-height: 16px !important } .wrapper .size-10 { font-size: 10px !important; line-height: 18px !important } .wrapper .size-11 { font-size: 11px !important; line-height: 19px !important } .wrapper .size-12 { font-size: 12px !important; line-height: 19px !important } .wrapper .size-13 { font-size: 13px !important; line-height: 21px !important } .wrapper .size-14 { font-size: 14px !important; line-height: 21px !important } .wrapper .size-15 { font-size: 15px !important; line-height: 23px !important } .wrapper .size-16 { font-size: 16px !important; line-height: 24px !important } .wrapper .size-17 { font-size: 17px !important; line-height: 26px !important } .wrapper .size-18 { font-size: 18px !important; line-height: 26px !important } .wrapper .size-20 { font-size: 20px !important; line-height: 28px !important } .wrapper .size-22 { font-size: 22px !important; line-height: 31px !important } .wrapper .size-24 { font-size: 24px !important; line-height: 32px !important } .wrapper .size-26 { font-size: 26px !important; line-height: 34px !important } .wrapper .size-28 { font-size: 28px !important; line-height: 36px !important } .wrapper .size-30 { font-size: 30px !important; line-height: 38px !important } .wrapper .size-32 { font-size: 32px !important; line-height: 40px !important } .wrapper .size-34 { font-size: 34px !important; line-height: 43px !important } .wrapper .size-36 { font-size: 36px !important; line-height: 43px !important } .wrapper .size-40 { font-size: 40px !important; line-height: 47px !important } .wrapper .size-44 { font-size: 44px !important; line-height: 50px !important } .wrapper .size-48 { font-size: 48px !important; line-height: 54px !important } .wrapper .size-56 { font-size: 56px !important; line-height: 60px !important } .wrapper .size-64 { font-size: 64px !important; line-height: 63px !important } } </style> <meta name="x-apple-disable-message-reformatting" /> <style type="text/css"> body { margin: 0; padding: 0; } table { border-collapse: collapse; table-layout: fixed; } * { line-height: inherit; } [x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; } .wrapper .footer__share-button a:hover, .wrapper .footer__share-button a:focus { color: #ffffff !important; } .btn a:hover, .btn a:focus, .footer__share-button a:hover, .footer__share-button a:focus, .email-footer__links a:hover, .email-footer__links a:focus { opacity: 0.8; } .preheader, .header, .layout, .column { transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out; } .preheader td { padding-bottom: 8px; } .layout, div.header { max-width: 400px !important; -fallback-width: 95% !important; width: calc(100% - 20px) !important; } div.preheader { max-width: 360px !important; -fallback-width: 90% !important; width: calc(100% - 60px) !important; } .snippet, .webversion { Float: none !important; } .stack .column { max-width: 400px !important; width: 100% !important; } .fixed-width.has-border { max-width: 402px !important; } .fixed-width.has-border .layout__inner { box-sizing: border-box; } .snippet, .webversion { width: 50% !important; } .ie .btn { width: 100%; } .ie .stack .column, .ie .stack .gutter { display: table-cell; float: none !important; } .ie div.preheader, .ie .email-footer { max-width: 560px !important; width: 560px !important; } .ie .snippet, .ie .webversion { width: 280px !important; } .ie div.header, .ie .layout { max-width: 600px !important; width: 600px !important; } .ie .two-col .column { max-width: 300px !important; width: 300px !important; } .ie .three-col .column, .ie .narrow { max-width: 200px !important; width: 200px !important; } .ie .wide { width: 400px !important; } .ie .stack.fixed-width.has-border, .ie .stack.has-gutter.has-border { max-width: 602px !important; width: 602px !important; } .ie .stack.two-col.has-gutter .column { max-width: 290px !important; width: 290px !important; } .ie .stack.three-col.has-gutter .column, .ie .stack.has-gutter .narrow { max-width: 188px !important; width: 188px !important; } .ie .stack.has-gutter .wide { max-width: 394px !important; width: 394px !important; } .ie .stack.two-col.has-gutter.has-border .column { max-width: 292px !important; width: 292px !important; } .ie .stack.three-col.has-gutter.has-border .column, .ie .stack.has-gutter.has-border .narrow { max-width: 190px !important; width: 190px !important; } .ie .stack.has-gutter.has-border .wide { max-width: 396px !important; width: 396px !important; } .ie .fixed-width .layout__inner { border-left: 0 none white !important; border-right: 0 none white !important; } .ie .layout__edges { display: none; } .mso .layout__edges { font-size: 0; } .layout-fixed-width, .mso .layout-full-width { background-color: #ffffff; } @media only screen and (min-width: 620px) { .column, .gutter { display: table-cell; Float: none !important; vertical-align: top; } div.preheader, .email-footer { max-width: 560px !important; width: 560px !important; } .snippet, .webversion { width: 280px !important; } div.header, .layout, .one-col .column { max-width: 600px !important; width: 600px !important; } .fixed-width.has-border, .fixed-width.x_has-border, .has-gutter.has-border, .has-gutter.x_has-border { max-width: 602px !important; width: 602px !important; } .two-col .column { max-width: 300px !important; width: 300px !important; } .three-col .column, .column.narrow, .column.x_narrow { max-width: 200px !important; width: 200px !important; } .column.wide, .column.x_wide { width: 400px !important; } .two-col.has-gutter .column, .two-col.x_has-gutter .column { max-width: 290px !important; width: 290px !important; } .three-col.has-gutter .column, .three-col.x_has-gutter .column, .has-gutter .narrow { max-width: 188px !important; width: 188px !important; } .has-gutter .wide { max-width: 394px !important; width: 394px !important; } .two-col.has-gutter.has-border .column, .two-col.x_has-gutter.x_has-border .column { max-width: 292px !important; width: 292px !important; } .three-col.has-gutter.has-border .column, .three-col.x_has-gutter.x_has-border .column, .has-gutter.has-border .narrow, .has-gutter.x_has-border .narrow { max-width: 190px !important; width: 190px !important; } .has-gutter.has-border .wide, .has-gutter.x_has-border .wide { max-width: 396px !important; width: 396px !important; } } @supports (display: flex) { @media only screen and (min-width: 620px) { .fixed-width.has-border .layout__inner { display: flex !important; } } } @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) { .fblike { background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important; } .tweet { background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important; } .linkedinshare { background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important; } .forwardtoafriend { background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important; } } @media (max-width: 321px) { .fixed-width.has-border .layout__inner { border-width: 1px 0 !important; } .layout, .stack .column { min-width: 320px !important; width: 320px !important; } .border { display: none; } .has-gutter .border { display: table-cell; } } .mso div { border: 0 none white !important; } .mso .w560 .divider { Margin-left: 260px !important; Margin-right: 260px !important; } .mso .w360 .divider { Margin-left: 160px !important; Margin-right: 160px !important; } .mso .w260 .divider { Margin-left: 110px !important; Margin-right: 110px !important; } .mso .w160 .divider { Margin-left: 60px !important; Margin-right: 60px !important; } .mso .w354 .divider { Margin-left: 157px !important; Margin-right: 157px !important; } .mso .w250 .divider { Margin-left: 105px !important; Margin-right: 105px !important; } .mso .w148 .divider { Margin-left: 54px !important; Margin-right: 54px !important; } .mso .size-8, .ie .size-8 { font-size: 8px !important; line-height: 14px !important; } .mso .size-9, .ie .size-9 { font-size: 9px !important; line-height: 16px !important; } .mso .size-10, .ie .size-10 { font-size: 10px !important; line-height: 18px !important; } .mso .size-11, .ie .size-11 { font-size: 11px !important; line-height: 19px !important; } .mso .size-12, .ie .size-12 { font-size: 12px !important; line-height: 19px !important; } .mso .size-13, .ie .size-13 { font-size: 13px !important; line-height: 21px !important; } .mso .size-14, .ie .size-14 { font-size: 14px !important; line-height: 21px !important; } .mso .size-15, .ie .size-15 { font-size: 15px !important; line-height: 23px !important; } .mso .size-16, .ie .size-16 { font-size: 16px !important; line-height: 24px !important; } .mso .size-17, .ie .size-17 { font-size: 17px !important; line-height: 26px !important; } .mso .size-18, .ie .size-18 { font-size: 18px !important; line-height: 26px !important; } .mso .size-20, .ie .size-20 { font-size: 20px !important; line-height: 28px !important; } .mso .size-22, .ie .size-22 { font-size: 22px !important; line-height: 31px !important; } .mso .size-24, .ie .size-24 { font-size: 24px !important; line-height: 32px !important; } .mso .size-26, .ie .size-26 { font-size: 26px !important; line-height: 34px !important; } .mso .size-28, .ie .size-28 { font-size: 28px !important; line-height: 36px !important; } .mso .size-30, .ie .size-30 { font-size: 30px !important; line-height: 38px !important; } .mso .size-32, .ie .size-32 { font-size: 32px !important; line-height: 40px !important; } .mso .size-34, .ie .size-34 { font-size: 34px !important; line-height: 43px !important; } .mso .size-36, .ie .size-36 { font-size: 36px !important; line-height: 43px !important; } .mso .size-40, .ie .size-40 { font-size: 40px !important; line-height: 47px !important; } .mso .size-44, .ie .size-44 { font-size: 44px !important; line-height: 50px !important; } .mso .size-48, .ie .size-48 { font-size: 48px !important; line-height: 54px !important; } .mso .size-56, .ie .size-56 { font-size: 56px !important; line-height: 60px !important; } .mso .size-64, .ie .size-64 { font-size: 64px !important; line-height: 63px !important; } </style> <!--[if !mso]><!--> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Roboto:400,700,400italic,700italic); </style> <link href="https://fonts.googleapis.com/css?family=Roboto:400,700,400italic,700italic" rel="stylesheet" type="text/css" /> <!--<![endif]--> <style type="text/css"> body { background-color: #fff } .logo a:hover, .logo a:focus { color: #859bb1 !important } .mso .layout-has-border { border-top: 1px solid #ccc; border-bottom: 1px solid #ccc } .mso .layout-has-bottom-border { border-bottom: 1px solid #ccc } .mso .border, .ie .border { background-color: #ccc } .mso h1, .ie h1 {} .mso h1, .ie h1 { font-size: 36px !important; line-height: 43px !important } .mso h2, .ie h2 {} .mso h2, .ie h2 { font-size: 20px !important; line-height: 28px !important } .mso h3, .ie h3 {} .mso .layout__inner, .ie .layout__inner {} .mso .footer__share-button p {} .mso .footer__share-button p { font-family: Avenir, sans-serif } </style> <meta name="robots" content="noindex,nofollow" /> <meta property="og:title" content="My First Campaign" /></head><!--[if mso]> <body class="mso"><![endif]--><!--[if !mso]><!--><body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"> <!--<![endif]--> <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"> <tbody> <tr> <td> <div role="banner"> <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"> <div style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]--> <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #969da3;font-family: Avenir,sans-serif;"> </div> <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]--> <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #969da3;font-family: Avenir,sans-serif;"> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container"> <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]--> <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center"> <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 227px;" src="https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/Asset24x.png?alt=media&token=9acb19df-4eb1-4f0d-bf93-694b3c7dcbd8" alt="" width="227" /></div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> <div> <div style="background-color: #373635;background: 65% 45%/auto auto no-repeat url(https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/agriculture-arable-barley-blur-265216.jpg?alt=media&token=9e8dafa8-3925-473b-bed4-2665c591b18b) #373635;background-position: 65% 45%;background-image: url(https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/agriculture-arable-barley-blur-265216.jpg?alt=media&token=9e8dafa8-3925-473b-bed4-2665c591b18b);background-repeat: no-repeat;background-size: auto auto;"> <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 65% 45%/auto auto no-repeat url(https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/agriculture-arable-barley-blur-265216.jpg?alt=media&token=9e8dafa8-3925-473b-bed4-2665c591b18b);background-repeat: no-repeat;background-size: auto auto;background-color: #373635;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]--> <div class="column" style="text-align: left;color: #5d5d5d;font-size: 14px;line-height: 21px;font-family: Roboto,Tahoma,sans-serif;"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div> </div> <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center"> <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #9f1b32;" href="https://www.farmestar.com/"><img style="border: 0;display: block;height: auto;width: 100%;max-width: 82px;" alt="" width="82" src="https://firebasestorage.googleapis.com/v0/b/farm-estar.appspot.com/o/Asset%203%404x.png?alt=media&token=b0037218-3e87-432f-8b71-ae5eb839394c" /></a> </div> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;Margin-bottom: 24px;"> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div> </div> </div> <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]--> </div> </div> </div> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div> <div style="background-color: #ffffff;"> <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #ffffff;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]--> <div class="column" style="text-align: left;color: #5d5d5d;font-size: 14px;line-height: 21px;font-family: Roboto,Tahoma,sans-serif;"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"> <h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #9f1b32;font-size: 30px;line-height: 38px;text-align: center;"> <strong>Thank you for your purchase!</strong></h1> <h3 style="Margin-top: 20px;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #a3a3a3;font-size: 16px;line-height: 24px;text-align: center;"> Your order is being prepared and will be ready shortly.</h3> </div> </div> <div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div> </div> <div style="Margin-left: 20px;Margin-right: 20px;"> <div class="divider" style="display: block;font-size: 2px;line-height: 2px;Margin-left: auto;Margin-right: auto;width: 40px;background-color: #ccc;Margin-bottom: 20px;"> &nbsp;</div> </div> <div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div> </div> <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;"> <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"> <p style="Margin-top: 0;Margin-bottom: 0;">We want to thank you for choosing FarmEstar for your purchase today. We truly value our customer experience so if there is anything we can do for you please email us at: <a href="mailto:Admin@farmestar.com">Admin@farmestar.com</a>&nbsp;</p> <p style="Margin-top: 20px;Margin-bottom: 0;">${req.body.transactionData.name}</p> ${iterateItems(req.body.transactionData.cart)} <p style="Margin-top: 20px;Margin-bottom: 0;"> $ ${req.body.transactionData.total}.00</p> <p style="Margin-top: 20px;Margin-bottom: 0;"> Transaction Id: ${req.body.transactionData.transactionID}</p> <p style="Margin-top: 20px;Margin-bottom: 0;"> Transaction Receipt: ${req.body.transactionData.receipt_url}</p> <p style="Margin-top: 20px;Margin-bottom: 0;">&nbsp;</p> <p style="Margin-top: 20px;Margin-bottom: 0;">Directions provided by GoogleMaps: </p> ${displayAddresses(req.body.transactionData.cart)} </div> </div> </div> <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]--> </div> </div> </div> <div role="contentinfo"> <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]--> <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #969da3;font-family: Avenir,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div style="font-size: 12px;line-height: 19px;"> <div>FarmEstar<br /> &nbsp;</div> </div> <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;"> <div>You are receiving this email because you made a purchase through the FarmEstar app. If you did not make this purchase please contact support.</div> </div> <!--[if mso]>&nbsp;<![endif]--> </div> </div> <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]--> <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #969da3;font-family: Avenir,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> </div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]--> <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #969da3;font-family: Avenir,sans-serif;"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div style="font-size: 12px;line-height: 19px;"> <unsubscribe style="text-decoration: underline;">Unsubscribe</unsubscribe> </div> </div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </div> </div> </div> <div style="line-height:40px;font-size:40px;">&nbsp;</div> </div> </td> </tr> </tbody> </table></body></html>`
    }
    transporter.sendMail(options, (err, resp) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('A confirmation email has been sent to ' + req.body.transactionData.email + '.')
        }
    })
})


//Helper Functions
function iterateItems(cart) {
    let body = ""

    cart.forEach(function (item) {
        body = body + `<p style="Margin-top: 20px;Margin-bottom: 0;">${item.product_details.title}: $${item.total} QTY: ${item.qty}</p>`
    })

    return body
}


function displayAddresses(cart) {
    let body = ""

    cart.forEach(function (item) {
        const address = item.farm_details.address + ", " + item.farm_details.city + ", " + item.farm_details.state
        body = body + `<a href="http://maps.google.com/maps?q=${address}">Click for directions to ${item.farm_details.farmName}</a>` + `<p style="Margin-top: 20px;Margin-bottom: 0;">&nbsp;</p>`
    })

    return body
}

function chargeDescription(cart) {
    let description = ""

    cart.forEach(function (item) {
        const itemDescription = item.product_details.title + ", QTY:" + item.qty + ", Price: " + item.product_details.price + ", Farm: " + item.farm_details.farmName + ", Address: " + item.farm_details.address + ", " + item.farm_details.city + ", " + item.farm_details.state + " | "
        description = description + itemDescription
    })

    return description
}




export { users }


