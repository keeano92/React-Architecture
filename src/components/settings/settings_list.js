/* eslint-disable react/prop-types */
import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
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

//Import actions
import {logout} from '../../actions/authActions'


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        color: 'rgba(38, 153, 251, 1)',
        paddingTop: '10%'
    }
}))




function SettingsList(props) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Divider />
            <List component="nav">
                <ListItem button onClick={props.actions.previousOrders}>
                    <ListItemIcon>
                        <div className="settings-icon">
                            <NotificationsIcon />
                        </div>
                    </ListItemIcon>
                    <ListItemText primary="Previous Orders" />
                </ListItem>
                <ListItem button onClick={props.actions.paymentSettings}>
                    <ListItemIcon>
                        <div className="settings-icon">
                            <SettingsIcon />
                        </div>
                    </ListItemIcon>
                    <ListItemText primary="Payment Settings" />
                </ListItem>
                <ListItem button onClick={props.actions.account}>
                    <ListItemIcon>
                        <div className="settings-icon">
                            <PersonIcon />
                        </div>
                    </ListItemIcon>
                    <ListItemText primary="Account" />
                </ListItem>
                <ListItem button onClick={props.actions.support}>
                    <ListItemIcon>
                        <div className="settings-icon">
                            <ContactSupportIcon />
                        </div>
                    </ListItemIcon>
                    <ListItemText primary="Contact" />
                </ListItem>
                <ListItem button onClick={props.actions.logout}>
                    <ListItemIcon>
                        <div className="logout-icon">
                            <ExitToAppIcon />
                        </div>
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    )
}
  
  export default SettingsList
