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

const roundTotal = (total) => {
    return (Math.round(total * 100) / 100).toFixed(2)
}

function CheckoutHeader(props) {
    return (
        <ThemeProvider theme={theme}>
            <div className="backbutton">
                <Button
                    component={Link}
                    to="/"
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                >
                    <ArrowBackIcon color="primary" fontSize="large" />
                </Button>
            </div>
            <div className="checkout-title-header">
               Payment
            </div>
            <div className="checkout-total-header">
                {"$" + roundTotal(props.total)}
            </div>
        </ThemeProvider>
    )
}

export default CheckoutHeader
