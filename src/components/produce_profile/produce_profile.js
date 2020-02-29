/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import './produce_profile.css'
import classnames from 'classnames'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

//Import Actions
import { addToCart, deleteProduct, toEditProduct } from '../../actions/authActions'


const theme = createMuiTheme({
    palette: {
        common: {
            black: 'rgba(38, 153, 251, 1)',
            white: '#fff',
            grey: 'rgb(128,128,128)'
        },
        background: {
            paper: 'rgba(38, 153, 251, 0)',
            default: 'rgba(38, 153, 251, 0)'
        },
        primary: {
            light: 'rgba(38, 153, 251, 1)',
            main: 'rgba(38, 153, 251, 1)',
            dark: 'rgba(38, 153, 251, 1)',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff4081',
            main: '#f50057',
            dark: '#c51162',
            contrastText: '#fff'
        },
        error: {
            light: '#e57373',
            main: '#f44336',
            dark: '#d32f2f',
            contrastText: '#fff'
        },
        text: {
            primary: 'rgba(38, 153, 251, 1)',
            secondary: 'rgba(38, 153, 251, 1)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)'
        }
    },
    overrides: {
        MuiInput: {
            underline: {
                borderBottom: 'rgba(38, 153, 251, 1)',
                '&:before': {
                    borderBottomColor: 'rgba(38, 153, 251, 1)',
                }
            }
        },
        MuiButtonLabel: {
            color: 'grey'
        },
        MuiPaper: {
            root:{
                backgroundColor: 'rgba(255, 255, 255, 1)'
            }
        }
    }
})


//Import Components
import ProduceProfileHeader from './produce_profile_header'

class ProduceProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product_details: { ...this.props.location.state.produce_data },
            farm_details: { ...this.props.location.state.farm_data },
            qty: 1,
            Ibs: 1,
            Oz: 0,
            total: this.props.location.state.produce_data.price,
            myFarm: this.props.location.state.farm_data.myFarm,
            index: this.props.location.state.produce_data.productIndex
        }
    }

    handleQty = e => {
        this.setState({ qty: e.target.value })
        const new_total = this.state.total * e.target.value
        this.setState({ total: new_total })
    }

    handleIbs = e => {
        this.setState({ Ibs: e.target.value })
    }

    handleOz = e => {
        this.setState({ Oz: e.target.value })
    }

    handleIbs_Oz = e => {
        // Need to map by splitting between two Dropdowns
        // this.setState({ Ibs: e.target.value })
    }

    addToCart = () => {
        const cart_item = { ...this.state }
        const current_cart = this.props.auth.cart

        //Add item to Cart
        current_cart.push(cart_item)
        //Now Persist to Store with Action
        this.props.addToCart(current_cart, this.props.history)
    }

    deleteProduct = () => {
        const payload = {
            product_id:this.state.product_details._id,
            product_index: this.state.index
        }
        this.props.deleteProduct(payload, this.props.history)
    }

    editProduct = () => {
        const payload = {
            farm_data: {...this.state.farm_details},
            product_details: {...this.state.product_details}
        }

        this.props.toEditProduct(payload, this.props.history)
    }

    roundTotal = (total) => {
        return (Math.round(total * 100) / 100).toFixed(2)
    }

    render() {
        let operationButtons
        let measurementBody

        if (this.state.myFarm) {
            //Display Edit & Delete
            operationButtons =
                <div className="product-operations-container">
                    <Button
                        style={{
                            width: "25%",
                            height: "48pt",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem",
                            marginRight: "1%"
                        }}
                        type="submit"
                        variant="contained"
                        className="edit-button"
                        onClick={this.editProduct}
                    ><EditIcon /></Button>
                     <Button
                        style={{
                            width: "25%",
                            height: "48pt",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem",
                            marginLeft :"1%"
                        }}
                        type="submit"
                        variant="contained"
                        onClick={this.deleteProduct}
                    ><DeleteForeverIcon color="error" /></Button>
                </div>
        } else {
            operationButtons = null
        }

        switch (this.state.product_details.measurement) {
            case "Ibs":
                measurementBody = <div className="product-qty-main-container">
                <div className="product-qty-text-container">
                    Ibs:
                </div>
                <div classnames="product-qty-form-control-container">
                    <FormControl className="">
                        <Select
                            labelId="Ibs"
                            id="Ibs"
                            value={this.state.Ibs}
                            onChange={this.handleQty}
                        >
                            <MenuItem value={0}><em>0</em></MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                            <MenuItem value={17}>17</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
                break;
            case "Oz":
                measurementBody = <div className="product-qty-main-container">
                <div className="product-qty-text-container">
                    Oz:
                </div>
                <div classnames="product-qty-form-control-container">
                    <FormControl className="">
                        <Select
                            labelId="Oz"
                            id="Oz"
                            value={this.state.Oz}
                            onChange={this.handleOz}
                        >
                            <MenuItem value={0}><em>0</em></MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                            <MenuItem value={17}>17</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
                break;
            case "Ibs_Oz":
                measurementBody = <div className="product-qty-main-container">
                <div className="product-qty-text-container">
                    Ibs:
                </div>
                <div classnames="product-qty-form-control-container">
                    <FormControl className="">
                        <Select
                            labelId="Ibs"
                            id="Ibs"
                            value={this.state.Ibs}
                            onChange={this.handleIbs}
                        >
                            <MenuItem value={0}><em>0</em></MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                            <MenuItem value={17}>17</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            measurementBody = <div className="product-qty-main-container">
            <div className="product-qty-text-container">
                Oz:
            </div>
            <div classnames="product-qty-form-control-container">
                <FormControl className="">
                    <Select
                        labelId="Oz"
                        id="Oz"
                        value={this.state.Oz}
                        onChange={this.handleOz}
                    >
                        <MenuItem value={0}><em>0</em></MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={13}>13</MenuItem>
                        <MenuItem value={14}>14</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={17}>17</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                        <MenuItem value={19}>19</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
                break;            
            default:
                break;
        }


        return (
            <ThemeProvider theme={theme}>
                <ProduceProfileHeader />
                <div className="produce-profile-body">
                    <div className="produce-profile-total">
                        ${this.roundTotal(this.state.total)}
                    </div>
                    <div className="product-detail-container">
                        <div className="product-name-container">
                            {this.state.product_details.title}
                        </div>
                        <div className="product-price-container">
                            ${this.roundTotal(this.state.product_details.price)}
                        </div>
                    </div>
                    {measurementBody}
                    <div className="product-qty-main-container">
                        <div className="product-qty-text-container">
                            QTY:
                        </div>
                        <div classnames="product-qty-form-control-container">
                            <FormControl className="">
                                <Select
                                    labelId="qty"
                                    id="qty"
                                    value={this.state.qty}
                                    onChange={this.handleQty}
                                >
                                    <MenuItem value={0}><em>0</em></MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={13}>13</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={16}>16</MenuItem>
                                    <MenuItem value={17}>17</MenuItem>
                                    <MenuItem value={18}>18</MenuItem>
                                    <MenuItem value={19}>19</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="add-to-cart-container">
                        <Button
                            style={{
                                width: "50%",
                                height: "48pt",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={this.addToCart}
                        >Add To Cart</Button>
                    </div>
                    {operationButtons}
                </div>
            </ThemeProvider>
        )
    }
}

ProduceProfile.propTypes = {
    addToCart: propTypes.func.isRequired,
    deleteProduct: propTypes.func.isRequired,
    toEditProduct: propTypes.func.isRequired
}

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth
})


export default connect(mapStateToProps, { addToCart, deleteProduct, toEditProduct })(ProduceProfile)