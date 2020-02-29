/* eslint-disable react/prop-types */
import React from 'react'

function SettingsHeader(props) {
    let headerDom

    if (props.auth.isAuthenticated == true) {
        headerDom = 
        <div className="settings-header-container">
             <div className="settings-header-name">{props.auth.user.name}</div>
            <div className="settings-header-email">{props.auth.user.email}</div>
        </div>
    } else {
        <div className="settings-header-container">
             <div className="settings-header-name">Guest Login</div>
            <div className="settings-header-email">Create profile for full features</div>
        </div>
    }

    return (headerDom)
}

export default SettingsHeader
