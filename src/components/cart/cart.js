import React, { Component } from 'react'
import './cart.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { withRouter} from 'react-router'
import Button from '@material-ui/core/Button'

//Import Actions
import {checkout} from '../../actions/authActions'

//Import Components
import CartHeader from './cart_header'
import CartMap from './cart_map'
import CartProducts from './cart_products'

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
        }
    }
})

class Cart extends Component {
    constructor(props){
        super(props)
        this.state = {
            cartTotal: 0
        }
    }

    componentDidMount = () => {
        this.calculateTotal()
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps !== this.props) {
            this.calculateTotal()
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

    checkoutHandle = () => {
        this.props.checkout(this.props.history)
    }

    render() {
        return (
            <div>
                <CartHeader total={this.state.cartTotal} />
                <div className="cart-map-container">
                    <CartMap {...this.props}/>
                </div>
                <div className="cart-list-container">
                    <CartProducts {...this.props}/>
                </div>
                <ThemeProvider theme={theme}>
                    <div className="" style={{ paddingLeft: "11.250px" }}>
                        <Button
                            onClick={this.checkoutHandle}
                            style={{
                                width: "90%",
                                height: "48pt",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            type="submit"
                            varient="contained"
                            color="primary"
                        >Pay Now</Button>
                    </div>
                </ThemeProvider>
            </div>
        )
    }
}

Cart.propTypes = {
    checkout: propTypes.func.isRequired
}

const mapStatetoProps = state => ({
    auth: state.auth
})

export default connect(mapStatetoProps, {checkout})(withRouter(Cart))
