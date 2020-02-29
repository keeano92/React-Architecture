import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import blue from '@material-ui/core/colors/blue'


const theme = createMuiTheme({
    palette: {
        primary: blue
    }
})

function UpdatePasswordHeader() {
    return (
        <ThemeProvider theme={theme}>
            <div className="container signup_header">
                Update Password
            </div>

        </ThemeProvider>
    )
}

export default UpdatePasswordHeader
