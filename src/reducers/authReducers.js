import {
    SET_CURRENT_USER,
    SET_GUEST_USER,
    CLEAR_GUEST_USER,
    USER_LOADING,
    SET_FARMS,
    SET_REVIEWS,
    SET_FARM_PROFILE,
    ADD_PRODUCE,
    ADD_TO_CART,
    REMOVE_PRODUCT,
    EDIT_PRODUCT,
    CLEAR_CART
} from '../actions/types'
import { REHYDRATE, PERSIST } from 'redux-persist/es/constants'


const isEmpty = require("is-empty")

const initialState = {
    isAuthenticated: false,
    isGuest: false,
    user: {},
    farms: [],
    reviews: [],
    profiles: [],
    produce: [],
    cart: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload.user,
                farms: action.payload.farms,
                produce: action.payload.produce,
                reviews: action.payload.reviews,
                profiles: action.payload.profiles,
                cart: []
            }
        case SET_GUEST_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload.user,
                isGuest: true,
                farms: action.payload.farms,
                produce: action.payload.produce,
                profiles: action.payload.profiles,
                cart: []
            }
        case CLEAR_GUEST_USER:
            return {
                isGuest: false
            }
        case USER_LOADING:
            return {
                ...state,
                loading: true
            }
        case SET_REVIEWS:
            return {
                ...state,
                reviews: action.payload,
                loading: true
            }
        case SET_FARM_PROFILE:
            return {
                ...state,
                farmProfile: action.payload,
                loading: true
            }
        case ADD_PRODUCE:
            console.log(action.payload)
            return {
                ...state,
                produce: [...state.produce, action.payload],
                loading: true
            }
        case EDIT_PRODUCT:
            // eslint-disable-next-line no-case-declarations
            const index = action.payload.product_index
            return {
                ...state,
                produce: state.produce.map((product, i) => {
                    if (i === index) {
                        product._id = action.payload.mapping_produce._id
                        product.farm = action.payload.mapping_produce.farm
                        product.title = action.payload.mapping_produce.title
                        product.description = action.payload.mapping_produce.description
                        product.price = action.payload.mapping_produce.price
                        product.sku = action.payload.mapping_produce.sku
                    }
                }),
                loading: true
            }
        case REMOVE_PRODUCT:
            //   const { product_index } = action.payload
            return {
                ...state,
                produce: state.produce.filter((item, index) => action.payload !== index),
                loading: true
            }
        case CLEAR_CART:
            return {
                ...state,
                cart: []
            }
        default:
            return state
    }
}

// case REMOVE_PRODUCT:
        //     // eslint-disable-next-line no-case-declarations
        //     const rmindex = action.payload.product_index
        //     // eslint-disable-next-line no-case-declarations
        //     let newProduce = [...state.produce]
        //     newProduce.splice(rmindex, 1)
        //     return {
        //         ...state,
        //        produce: newProduce,
        //        loading: true
        //     }