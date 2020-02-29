/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import './settings.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

//Import Actions
import { logout, previousOrders, paymentSettings, account, support } from '../../actions/authActions'

//Import Components
import DashboardHeader from '../dashboard/dashboard_header'
import SettingsHeader from './settings_header'
import SettingsList from './settings_list_new'

class Settings extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

     logout = e => {
        e.preventDefault()
        this.props.logout(this.props.history)
    }

    previousOrders = e => {
        e.preventDefault()
        this.props.previousOrders(this.props.history)
    }

    paymentSettings = e => {
        e.preventDefault()
        this.props.paymentSettings(this.props.history)
    }

    account = e => {
        e.preventDefault()
        this.props.account(this.props.history)
    }

    support = e => {
        e.preventDefault()
        this.props.support(this.props.history)
    }

    render() {
        return (
            <div>
                <DashboardHeader />
                <SettingsHeader auth={this.props.auth} isGuest={this.props.isGuest}/>
                <SettingsList actions={{logout:this.logout, orders: this.previousOrders, paymentSettings: this.paymentSettings, account: this.account, support: this.support}} />
            </div>
        )
    }
}

Settings.propTypes = {
    logout: propTypes.func.isRequired,
    previousOrders: propTypes.func.isRequired,
    paymentSettings: propTypes.func.isRequired,
    account: propTypes.func.isRequired,
    support: propTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logout,previousOrders,paymentSettings,account,support})(Settings)
