/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import './forgot_password.css'
import { withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import PersonIcon from '@material-ui/icons/Person'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import {forgotPasswordPerform} from '../../actions/authActions'
import {ForgotPasswordHeader} from './forgot_password_header'

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

class forgotPassword extends Component {
    constructor(){
        super();
        this.state = {
            email: "",
            errors: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            //Persist Errors
            if (this.state.errors !== this.props.errors) {
                this.setState(this.props)
            }
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault()

        const userData = {
            email: this.state.email
        }

        this.props.forgotPasswordPerform(userData, this.props.history)
    }

    render() {
        const { errors } = this.state
        return (
            <ThemeProvider theme={theme}> 
            <ForgotPasswordHeader />
                <div className="container">
                    <p>No problem, we can send you an email!</p>
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="email_container">
                            <TextField
                                onChange={this.onChange}
                                value={this.state.email}
                                id="email"
                                type="email"
                                margin="normal"
                                label="Email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("login_textfield", {
                                    invalid: errors.email || errors.emailnotfound
                                })}
                            />
                            <span style={{ color: theme.palette.error.main }}>
                                {errors.email}
                                {errors.emailnotfound}
                            </span>
                        </div>
                        <div className="login_button" style={{ paddingLeft: "11.250px" }}>
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
                            >Send Reset Email</Button>
                        </div>
                    </form>
                    </div>
            </ThemeProvider>
            
        )
    }
}

forgotPassword.propTypes = {
    forgotPasswordPerform: propTypes.func.isRequired,
    errors: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    errors: state.errors
})

export default connect(mapStateToProps, { forgotPasswordPerform })(withRouter(forgotPassword))

