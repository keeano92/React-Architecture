/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import './payment_success.css'
import errorX from '../../assets/images/redX.png'
import succesfull from '../../assets/images/animated-check.gif'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import PhoneIcon from '@material-ui/icons/Phone'


//Actions
import { setPhoneNumber, clearCart } from '../../actions/authActions'

class PaymentSuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            success: this.props.location.state.success,
            message: this.props.location.state.message,
            phone: "",
            email: this.props.location.state.email,
            cart: [...this.props.location.state.cart],
            total: this.props.location.state.total,
            transactionID: this.props.location.state.transactionID,
            lastFour: this.props.location.state.lastFour,
            name: this.props.location.state.name,
            receipt_url: this.props.location.state.receipt_url
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault()

        const chargeData = {
            ...this.state
        }

        //Clear Cart, Then Submit Number Update
        this.props.clearCart(chargeData)

        // eslint-disable-next-line react/prop-types
        this.props.setPhoneNumber(chargeData, this.props.history)
    }

    tryAgain = e => {
        e.preventDefault()
        history.push("/checkout")
    }

    cancelPayment = e => {
        e.preventDefault()
        history.push("/dashboard")
    }

    render() {
        //Handle conditional based on the transaction
        let body

        if (this.state.success === true) {
            body = <div>
                <div className="payment-success-image-container">
                    <img height="200px" width="200px" src={succesfull} />
                </div>
                <div className="message-container">
                <p>You're payment was succesfull, you will recieve an email with more details.
                Please enter your phone number for Farmer contact if needed on your order.</p>
                </div>  
                <div className="phone-upload-container">
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="phone_container">
                            <TextField
                                onChange={this.onChange}
                                value={this.state.phone}
                                id="phone"
                                type="phone"
                                margin="normal"
                                label="Phone"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        <Button
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
                        >SEND</Button>
                    </form>
                </div>
            </div>
        } else {
            body = <div>
                <div className="payment-success-image-container">
                    <img height="200px" width="200px" src={errorX} />
                </div>
                <div className="message-container">
                <p>There was an issue with your payment, please try again.</p>
                <p>{this.state.message}</p>
                </div>
                <div className="phone-upload-container">
                    <Button
                        onClick={this.tryAgian}
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
                    >Try Again</Button>
                    <Button
                        onClick={this.cancelPayment}
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
                    >Cancel</Button>
                </div>
            </div>
        }

        return (
            <div className="payment-message-container">
                {body}
            </div>
        )
    }
}

PaymentSuccess.propTypes = {
    setPhoneNumber: propTypes.func.isRequired,
    clearCart: propTypes.func.isRequired
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, { setPhoneNumber, clearCart })(PaymentSuccess)