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

function CreateFarmProfileHeader() {
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
            <div className="container signup_header">
                Farm Profile
            </div>

        </ThemeProvider>
    )
}

export default CreateFarmProfileHeader
