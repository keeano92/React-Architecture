/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//Import Actions
import { logout } from '../../actions/authActions'

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

class SettingsList extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    // logout = e => {
    //     e.preventDefault()
    //     this.props.logout(this.props.history)
    // }

    // previousOrders = e => {
    //     e.preventDefault()
    //     this.props.history.push("/previousOrders")
    // }

    // paymentSettings = e => {
    //     e.preventDefault()
    //     this.props.history.push("/paymentSettings")
    // }

    // account = e => {
    //     e.preventDefault()
    //     this.props.history.push("/account")
    // }

    // support = e => {
    //     e.preventDefault()
    //     this.props.history.push("/support")
    // }

    render() {
        // const classes = useStyles()
        return (
            <ThemeProvider theme={theme}>
                <Divider />
                <List component="nav">
                    <ListItem button onClick={this.props.actions.previousOrders}>
                        <ListItemIcon>
                            <div className="settings-icon">
                                <NotificationsIcon />
                            </div>
                        </ListItemIcon>
                        <ListItemText primary="Previous Orders" />
                    </ListItem>
                    <ListItem button onClick={this.props.actions.paymentSettings}>
                        <ListItemIcon>
                            <div className="settings-icon">
                                <SettingsIcon />
                            </div>
                        </ListItemIcon>
                        <ListItemText primary="Payment Settings" />
                    </ListItem>
                    <ListItem button onClick={this.props.actions.account}>
                        <ListItemIcon>
                            <div className="settings-icon">
                                <PersonIcon />
                            </div>
                        </ListItemIcon>
                        <ListItemText primary="Account" />
                    </ListItem>
                    <ListItem button onClick={this.props.actions.support}>
                        <ListItemIcon>
                            <div className="settings-icon">
                                <ContactSupportIcon />
                            </div>
                        </ListItemIcon>
                        <ListItemText primary="Contact" />
                    </ListItem>
                    <ListItem button onClick={this.props.actions.logout}>
                        <ListItemIcon>
                            <div className="logout-icon">
                                <ExitToAppIcon />
                            </div>
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </ThemeProvider>
        )
    }
}

SettingsList.propTypes = {
    logout: propTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: propTypes.object.isRequired
})

export default connect(mapStateToProps, { logout })(SettingsList)
