import express, { response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import mailer from 'nodemailer'
import transport from 'nodemailer-sendgrid-transport'
import keys from '../../config/keys'
import NodeGeocoder from 'node-geocoder'


//Validation

//Models
import { Farm } from '../../models/farm'
import { FarmProfile } from '../../models/farmProfile'
import { Produce } from '../../models/produce'
import { User } from '../../models/user'

var farms = express.Router()


// @route POST api/farm/add
// @desc Add a new Farm
// @access Public
farms.post("/add", (req, response) => {
    //Perform Validation Here
    // let response 

    var options = {
        provider: 'google',
        httpAdaptor: 'https',
        apiKey: 'AIzaSyDzPWbAxZiZwpnen7giLpjhiKPHaFa48D4',
        formatter: null
    }

    const geocoder = NodeGeocoder(options)

    geocoder.geocode({
        address: req.body.address,
        country: "United States",
        zipcode: req.body.zipcode
    }, function (err, res) {
        const lat = res[0].latitude
        const long = res[0].longitude


        //Define Farm to Map to DB
        const farm = new Farm({
            farmer: req.body.farmer,
            farmName: req.body.farmName,
            address: req.body.address,
            city: req.body.city,
            zipcode: req.body.zipcode,
            state: req.body.state,
            imageUrl: req.body.imageUrl,
            farmerType: req.body.farmerType,
            location: {
                type: "Point",
                coordinates: [lat, long]
            }
        })

        //Save new farm to the DB
        farm
            .save()
            .then(farm => {
                User.findOneAndUpdate({ _id: req.body.farmer }, { $set: { needsFarm: "false" } }, { new: true }, (err, user) => {
                    response.json(farm)
                })
            })
            .catch(err => {
                response.json(err)
            })
    })
})

    // @route POST api/farm/addProfile
    // @desc Add a new farm profile
    // @access Public
    farms.post("/addFarmProfile", (req, res) => {
        //Perform Validation Here

        const profile = new FarmProfile({
            farmer: req.body.farmer,
            farm: req.body.farm,
            displayName: req.body.displayName,
            description: req.body.description,
            imageUrl: req.body.imageUrl
        })

        //Save new farmer profile to the DB
        profile
            .save()
            .then(profile => {
                res.json(profile)
            })
            .catch(err => res.json(err))
    })


    // @route GET api/farm/farms
    // @desc Get all farms
    // @access Public
    farms.get("/farms", (req, res) => {
        const payload = {
            farms: []
        }

        //Get Farms
        Farm.find({}, function (err, farms) {
            farms.forEach((farm) => {
                payload.farms.push(farm)
            })

            res.json(payload)
        })
    })

    // @route POST api/farm/farmProfile
    // @desc Get a farm profile
    // @access Public
    farms.post("/farmProfile", (req, res) => {
        const farm_id = req.body.farm._id
        console.log(farm_id)

        //find farm profile from farm id
        FarmProfile.findOne({ 'farm': farm_id }, function (err, profile) {
            res.json(profile)
        })
            .catch(err => res.json(err))
    })

    // @route POST api/farm/addProduce
    // @desc add a new produce to farm
    // @access Public
    farms.post("/addProduce", (req, res) => {
        const produce = new Produce({
            farm: req.body.farm,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            measurement: req.body.measurement,
            sku: req.body.sku
        })

        //Add Produce with mapping to the farm
        produce
            .save()
            .then(item => {
                res.json(item)
            })
            .catch(err => res.json(err))
    })

    // @route POST api/farm/editProduct
    // @desc edit a product from a farm
    // @access Public
    farms.post("/editProduct", (req, res) => {
        const product_id = req.body.product_id

        //Edit Product with mapping to the farm
        Produce.findOneAndUpdate({ _id: product_id },
            {
                $set:
                {
                    farm: req.body.farm,
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    sku: req.body.sku
                }
            }, { new: true }, (err, product) => {
                if (err) {
                    res.json(err)
                }
                res.json("Product Updated Succesfully: " + JSON.stringify(product));
            })
    })

    // @route POST api/farm/deleteProduct
    // @desc delete product from farm
    // @access Public
    farms.post("/deleteProduct", (req, res) => {
        const productId = req.body.productId


        //Delete Product from Farm
        Produce.findByIdAndDelete(productId, function (err) {
            if (err) res.json(err)
            res.json({ "message": "Successfully deleted item: " + productId })
        })
    })


    // @route POST api/farm/addHours
    // @desc add hours to farm
    // @access Public
    farms.post("/addHours", (req, res) => {
        const farm_id = req.body.farm_id

        //Edit Product with mapping to the farm
        FarmProfile.findOneAndUpdate({ farm: farm_id },
            {
                $set:
                {
                    hours: {
                        monOpen: req.body.hours.monOpen,
                        monClose: req.body.hours.monClose,
                        tuesOpen: req.body.hours.tuesOpen,
                        tuesClose: req.body.hours.tuesClose,
                        wedOpen: req.body.hours.wedOpen,
                        wedClose: req.body.hours.wedClose,
                        thurOpen: req.body.hours.thurOpen,
                        thurClose: req.body.hours.thurClose,
                        friOpen: req.body.hours.friOpen,
                        friClose: req.body.hours.friClose,
                        satOpen: req.body.hours.satOpen,
                        satClose: req.body.hours.satClose,
                        sunOpen: req.body.hours.sunOpen,
                        sunClose: req.body.hours.sunClose
                    }
                }
            }, { new: true }, (err, farm_profile) => {
                if (err) {
                    res.json(err)
                }
                res.json("Hours Updated Succesfully: " + JSON.stringify(farm_profile));
            })
    })

    export { farms }