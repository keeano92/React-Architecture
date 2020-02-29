import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import blue from '@material-ui/core/colors/blue'

const theme = createMuiTheme({
    palette: {
        primary: blue
    }
})

function CartHeader(props) {

    return (
        <ThemeProvider theme={theme}>
            <div className="container cart-header">
                Cart
            </div>
            <div className="header-price-total">
                ${props.total}
            </div>
            <div className="total-text">
                Total
            </div>
        </ThemeProvider>

    )
}

export default CartHeader
