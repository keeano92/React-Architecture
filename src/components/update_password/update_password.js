/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import './update_password.css'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { updatePassword } from '../../actions/authActions'
import classnames from 'classnames'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';

//Import Components
import UpdatePasswordHeader from './update_password_header'


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

class UpdatePassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            password2: "",
            token: "",
            errors: {}
        }
    }

    componentDidMount(){
        if (this.props.match.params.token) {
            this.setState({token: this.props.match.params.token})
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            //Persist Errors
            if (this.state.errors !== this.props.errors) {
                this.setState(this.props)
            }
            if (this.props.match.params.token) {
                this.setState({token: this.props.match.params.token})
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
            password: this.state.password,
            password2: this.state.password2,
            token: this.state.token
        }

        this.props.updatePassword(userData, this.props.history)
    }


    render() {
        const { errors } = this.state
        let updatePasswordBlock

        if (this.state.token != "") {
           updatePasswordBlock = 
           <ThemeProvider theme={theme}>
               <UpdatePasswordHeader />
            <div className="container">
                <form noValidate onSubmit={this.onSubmit}>
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
                        >Update</Button>
                    </div>
                </form>
            </div>
        </ThemeProvider>
        }else {
          updatePasswordBlock = <div><UpdatePasswordHeader /><p>The verification token provided in this email does not match one in our database. This can be caused from the token expiring. Please navigate back to forgot password in Farm Estar and request a new email. Thank you!</p></div>
        }
        return (updatePasswordBlock)
    }
}

UpdatePassword.propTypes = {
    updatePassword: propTypes.func.isRequired,
    token: propTypes.string,
    errors: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    token: state.token,
    errors: state.errors
})

export default connect(mapStateToProps, {updatePassword})(withRouter(UpdatePassword))
