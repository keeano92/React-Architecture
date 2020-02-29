import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements';

class CheckoutForm extends Component {
    render() {
        return (
            <div>
                <CardElement />
            </div>
        )
    }
}

export default CheckoutForm
