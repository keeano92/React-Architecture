/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {useAsync} from "react-async"
import {CardElement, injectStripe} from 'react-stripe-elements';

class CheckoutStatus extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    async submit(ev) {
        let {token} = await this.props.stripe.createToken({name: "Test"})
        chargeCard(token.id, this.props.history)
      }


    render() {
        return (
            <button onClick={this.submit}>Purchase</button>
        )
    }
}

export default useAsync(CheckoutStatus)
