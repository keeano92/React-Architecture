/* eslint-disable react/prop-types */
import React from 'react'
import './register.css'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { registerUser } from '../../actions/authActions'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import PersonIcon from '@material-ui/icons/Person'
import LockIcon from '@material-ui/icons/Lock'
import EmailIcon from '@material-ui/icons/Email'

//Import Components
import SignupHeader from './register_header'
import SignupFooter from './register_footer'


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

class register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
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

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        }

        this.props.registerUser(newUser, this.props.history)
    }

    render() {
        const { errors } = this.state;

        return (
            <ThemeProvider theme={theme}>
                <SignupHeader />
                <div className="container">
                    <form noValidate onSubmit={this.onSubmit}>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.name}
                                id="name"
                                type="text"
                                margin="normal"
                                label="Name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.name })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.name}</span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.email}
                                id="email"
                                type="email"
                                margin="normal"
                                label="Email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.email })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.email}</span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.password}
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                label="Password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.password })}
                            />
                            <span style={{ color: theme.palette.error.main }}></span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.password2}
                                id="password2"
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                label="Confirm Password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.password2 })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.password2}</span>
                        </div>
                        <div className="signup_button" style={{ paddingLeft: "11.250px" }}>
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
                    <div className="terms-policy-container">
                        By logging in you agree to our {" "}<Link to="/terms"> terms and services policy</Link>
                    </div>
                </div>
                <SignupFooter />
            </ThemeProvider>
        )
    }
}

register.protoTypes = {
    registerUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    errors: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { registerUser })(withRouter(register))