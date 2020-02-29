/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import './account.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'

//Import Actions
import { editAccount } from '../../actions/authActions'

//import components
import AccountHeader from './account_header'


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

class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    editProfile = e => {
        e.preventDefault()
        this.props.editAccount(this.props.auth.user, this.props.history)
    }

    render() {
        return (
            <div>
                <AccountHeader {...this.props} />
                <ThemeProvider theme={theme}>
                    <List>
                        <ListItem>
                            <ListItemText primary={this.props.auth.user.email} secondary=""></ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Button
                            onClick={this.editProfile}
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
                            ><EditIcon /> Edit Profile</Button>
                        </ListItem>
                        <Divider />
                    </List>
                    <Divider />
                </ThemeProvider>
            </div>
        )
    }
}

Account.propTypes = {
    editAccount: propTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {editAccount})(Account)
