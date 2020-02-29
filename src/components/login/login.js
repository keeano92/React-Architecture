/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';

//Import Actions
import { loginUser, setupDashboard, loginGuest } from '../../actions/authActions'

//Import Components
import { LoginHeader } from './login_header'
import { LoginFooter } from './login_footer'


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

export class login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        }
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard")
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            //Persist Login State
            if (this.props.auth.isAuthenticated) {
                this.props.history.push("/dashboard")
            }
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
            email: this.state.email,
            password: this.state.password
        }

        this.props.loginUser(userData)
    }

    onGuestLogin = e => {
        this.props.loginGuest()
    }

    render() {
        const { errors } = this.state

        return (
            <ThemeProvider theme={theme}>
                <LoginHeader />
                <div className="container">
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
                        <div className="password_container">
                            <TextField
                                onChange={this.onChange}
                                value={this.state.password}
                                id="password"
                                type="password"
                                margin="normal"
                                autoComplete="current-password"
                                label="Password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("login_textfield", {
                                    invalid: errors.password || errors.passwordincorrect
                                })}
                            />
                            <span style={{ color: theme.palette.error.main }}>
                                {errors.password}
                                {errors.passwordincorrect}
                            </span>
                        </div>
                        <div className="container">
                            <Link to="/forgotPassword">Forgot Password?</Link>
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
                            >CONTINUE</Button>
                        </div>
                    </form>
                    <div>
                        <Button
                            onClick={this.onGuestLogin}
                            style={{
                                width: "90%",
                                height: "48pt",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem",
                                color: "grey"
                            }}
                        >Login as Guest</Button>
                    </div>
                    <div className="terms-policy-container">
                        By logging in you agree to our {" "}<Link to="/terms"> terms and services policy</Link>
                    </div>
                </div>
                <LoginFooter />
            </ThemeProvider>
        )
    }
}

login.propTypes = {
    loginUser: propTypes.func.isRequired,
    loginGuest: propTypes.func.isRequired,
    setupDashboard: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    errors: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { loginUser, setupDashboard, loginGuest })(login)