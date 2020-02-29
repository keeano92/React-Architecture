import React, { Component } from 'react'
import { withRouter } from 'react-router'
import './terms.css'
import Iframe from 'react-iframe'
import Button from '@material-ui/core/Button'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

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

class Terms extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    handleContinue = () => {
        this.props.history.push("/login")
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="terms-container">
                    <Iframe url="https://farmestar.com/our-terms-and-policies/"
                        width="100%"
                        id="iframe" />
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
                        onClick={this.handleContinue}
                    >CONTINUE</Button>
                </div>
            </ThemeProvider>
        )
    }
}

export default withRouter(Terms)
