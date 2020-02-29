/* eslint-disable react/prop-types */
import React from 'react'
import './create_farmer.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from 'react-responsive-modal'
import { registerFarmer } from '../../actions/farmActions'

//Import Components
import CreateFarmerHeader from './create_farmer_header'
import CreateFarmerFooter from './create_farmer_footer'

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


class CreateFarmer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            lastName: "",
            email: "",
            password: "",
            password2: "",
            isLegalVerified: false,
            modalOpen: false,
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

    onSubmit = () => {

        const newUser = {
            name: this.state.name,
            lastName: this.state.lastName,
            email: this.state.email,
            isLegalVerified: this.state.isLegalVerified,
            isFarmer: true,
            password: this.state.password,
            password2: this.state.password2
        }

        this.props.registerFarmer(newUser, this.props.history)
    }

    onOpenModal = e => {
        e.preventDefault()
        this.setState({ modalOpen: true });
    }

    onCloseModal = () => {
        this.setState({ modalOpen: false });
        this.onSubmit()
    }

    render() {
        const { errors } = this.state
        return (
            <ThemeProvider theme={theme}>
                <CreateFarmerHeader />
                <div className="container">
                    <form noValidate onSubmit={this.onOpenModal}>
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
                                value={this.state.lastName}
                                id="lastName"
                                type="text"
                                margin="normal"
                                label="Last Name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", {})}
                            />
                            <span style={{ color: theme.palette.error.main }}>{}</span>
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
                        <div className="is-legal">
                            <FormControlLabel
                                control={
                                    <Checkbox id="isLegalVerified" checked={this.state.isLegalVerified} onChange={this.onChange} value={true} />
                                }
                            />
                            I agree to follow all required state and federal laws
                        </div>
                        <div className="" style={{ paddingLeft: "11.250px" }}>
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
                                disabled={this.state.isLegalVerified === false}
                            >CONTINUE</Button>
                        </div>
                    </form>
                </div>
                <Modal open={this.state.modalOpen} onClose={this.onCloseModal} center>
                    <h2>by continuing, I hereby agree to a 10% transaction handling fee</h2>
                </Modal>
                <CreateFarmerFooter />
            </ThemeProvider>
        )
    }
}


CreateFarmer.propTypes = {
    registerFarmer: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    errors: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { registerFarmer })(withRouter(CreateFarmer))