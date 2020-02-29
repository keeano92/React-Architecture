import React from 'react'
import { Link } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import blue from '@material-ui/core/colors/blue'


const theme = createMuiTheme({
    palette: {
        primary: blue
    }
})

function landing() {
    return (
        <ThemeProvider theme={theme}>
            <div className="button-container">
                <div className="login-button-container">
                    <Button 
                        component={Link}
                        style={{
                            width: "85%",
                            height: "48px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px"
                        }}
                        to="/login"
                        variant="contained"
                        color="primary">
                        LOG IN
                    </Button>
                </div>
                <div className="signup-button-container">
                    <Button
                        component={Link}
                        style={{
                            width: "85%",
                            height: "48px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px"
                        }}
                        to="/register"
                        variant="contained"
                        color="primary">
                        SIGN UP
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    )
}

export { landing }
