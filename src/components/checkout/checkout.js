/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import './checkout.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import {
    CardNumberElement, CardExpiryElement,
    CardCvcElement, injectStripe
} from 'react-stripe-elements';

//Import Actions
import { chargeCard, continueShopping } from '../../actions/authActions'

//Import Components
import CheckoutHeader from './checkout_header'

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
        // MuiInput: {
        //     underline: {
        //         borderBottom: '',
        //         '&:before': {
        //             borderBottomColor: '',
        //         }
        //     }
        // },
        MuiTextField: {
            outline: {
                borderColor: "rgba(38, 153, 251, 1)"
            }
        },
        MuiButtonLabel: {
            color: 'grey'
        }
    }
})



class Checkout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartTotal: 0,
            cardholdersName: "",
            name: this.props.auth.user.name,
            email: this.props.auth.user.email
        }
    }

    calculateTotal = () => {
        let total = 0
        this.props.auth.cart.map((product) => {
            total = total + product.total
            this.setState({
                cartTotal: total
            })
        })
    }

    componentDidMount = () => {
        this.calculateTotal()
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps !== this.props) {
            this.calculateTotal()
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value })
    }


    handleSubmit = (ev) => {
        ev.preventDefault()
        if (this.props.stripe) {
            this.props.stripe
                .createToken()
                .then((payload) => {
                    console.log("Stripe PayLoad: " + JSON.stringify(payload))
                    const postData = {
                        tokenId: payload.token.id,
                        total: this.state.cartTotal,
                        cart: [...this.props.auth.cart],
                        email: this.state.email,
                        name: this.state.name
                    }
                    console.log("Stripe Post Data: " + JSON.stringify(postData))
                    this.props.chargeCard(postData, this.props.history)
                })
        }
    }

    continueShopping = (e) => {
        this.props.continueShopping(this.props.history)
    }


    render() {
        //Checkout form styling outside of CSS injection
        const style = {
            base: {
                color: "rgba(38, 153, 251, 1)",
                iconColor: "rgba(38, 153, 251, 1)"
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
        return (
            <ThemeProvider theme={theme}>
                <CheckoutHeader total={this.state.cartTotal} />
                <form onSubmit={this.handleSubmit}>
                    <div className="checkout-form-container">
                        <label className="checkout-form-titles">
                            CARD NUMBER
                            <div className="checkout-form-textfield">
                                <CardNumberElement style={style} />
                            </div>
                        </label>
                    </div>
                    <div className="checkout-form-container">
                        <label className="checkout-form-titles">
                            CARDHOLDERS NAME
                            </label>
                        <div className="checkout-form-textfield">
                            <input
                                onChange={this.onChange}
                                value={this.state.cardholdersName}
                                id="cardholdersName"
                                placeholder="CardHolders Name"
                                variant="outlined"
                                className="StripeElement"
                            />
                        </div>
                    </div>

                    <div className="checkout-form-container">
                        <label className="checkout-form-titles">
                            EXPERATION DATE
                            <div className="checkout-form-textfield">
                                <CardExpiryElement style={style} />
                            </div>
                        </label>
                    </div>
                    <div className="checkout-form-container">
                        <label className="checkout-form-titles">
                            CVV
                            <div className="checkout-form-textfield">
                                <CardCvcElement style={style} />
                            </div>
                        </label>
                    </div>
                    <div className="checkout-form-button">
                        <Button
                            style={{
                                width: "50%",
                                height: "48pt",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "2%"
                            }}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >Pay Now</Button>
                    </div>
                </form>
                <div className="checkout-form-button">
                    <Button
                        onClick={this.continueShopping}
                        style={{
                            width: "90%",
                            height: "48pt",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                    >Continue Shopping</Button>
                </div>
            </ThemeProvider>
        )
    }
}

Checkout.propTypes = {
    auth: propTypes.object.isRequired,
    chargeCard: propTypes.func.isRequired,
    continueShopping: propTypes.func.isRequired
}

const mapStatetoProps = state => ({
    auth: state.auth
})

export default connect(mapStatetoProps, { chargeCard, continueShopping })(injectStripe(withRouter(Checkout)))
