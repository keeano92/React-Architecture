import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import { setCurrentUser, clearGuestUser } from './authActions'

import {
    GET_ERRORS
} from './types'


//Register Farmer
export const registerFarmer = (userData, history) => dispatch => {
    axios
        .post("/api/users/register", userData)
        .then(res => {
            //Get FarmersId and pass it into view to map data
            console.log(JSON.stringify(res))
            history.push({
                pathname: '/addFarm',
                state: {
                    farmerId: res.data._id,
                    fromModal: false
                }
            })
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        )
}

//Add Farm Persistance
export const addFarmModal = (farmerID, history) => dispatch => {
    history.push({
        pathname: '/addFarm',
        state: {
            farmerId: farmerID,
            fromModal: true
        }
    })
}

//Add Farm
export const addFarm = (farmData, fromModal, history) => dispatch => {
    console.log(JSON.stringify(farmData))

    history.push({
        pathname: '/addFarmProfile',
        state: {
            farmer: farmData.farmer,
            farmName: farmData.farmName,
            address: farmData.address,
            city: farmData.city,
            zipcode: farmData.zipcode,
            state: farmData.state,
            farmerType: farmData.farmerType,
            fromModal: fromModal
        }
    })
}

//Add Profile
export const addProfile = (profileData, fromModal, history) => dispatch => {
    const addFarmPayload = {
        farmer: profileData.farmer,
        farmName: profileData.farmName,
        address: profileData.address,
        city: profileData.city,
        zipcode: profileData.zipcode,
        state: profileData.state,
        farmerType: profileData.farmerType
    }
    // Make API call to register Farm
    axios
        .post("/api/farm/add", addFarmPayload)
        .then(res => {
            const payload = {
                farmer: profileData.farmer,
                farm: res.data._id,
                displayName: profileData.displayName,
                description: profileData.description,
                imageUrl: profileData.imageUrl
            }

            //Make API call to register Farm Profile
            axios
                .post("/api/farm/addFarmProfile", payload)
                .then(res => {
                    history.push({
                        pathname: "/farmHours",
                        state: {
                            farmId: res.data.farm,
                            fromModal: fromModal
                        }
                    })
                })
                .catch(err =>
                    dispatch({
                        type: GET_ERRORS,
                        payload: err.response.data
                    })
                )
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        )
}

//Set Farm Hours
export const setHours = (data, fromModal, history) => dispatch => {
    console.log(data)
    //Pass hours to the farmId passed in data and update it
    const payload = {
        farm_id: data.farmId,
        hours: {
            monOpen: data.mon.open,
            monClose: data.mon.close,
            tuesOpen: data.tues.open,
            tuesClose: data.tues.close,
            wedOpen: data.wed.open,
            wedClose: data.wed.close,
            thurOpen: data.thur.open,
            thurClose: data.thur.close,
            friOpen: data.fri.open,
            friClose: data.fri.close,
            satOpen: data.sat.open,
            satClose: data.sat.close,
            sunOpen: data.sun.open,
            sunClose: data.sun.close
        }
    }
    axios
        .post("/api/farm/addHours", payload)
        .then(res => {
            // if (fromModal) {
            //     // dispatch(logout)
            //     logout()
            // }else {
            //     history.push("/login")
            // } 
            //Remove token
            localStorage.removeItem("jwtToken")
            localStorage.removeItem("persist:root")
            //Remove Header
            setAuthToken(false)
            //Reset User
            dispatch(setCurrentUser({}))
            dispatch(clearGuestUser({}))
            history.push("/login")
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        )
}