import React, { Component } from 'react'
import './market.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

//Import Actions
import { farmProfile } from '../../actions/authActions'

//Import Components
import MarketHeader from './market_header'
import Farms from './farms'



class Market extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    handleFarmProfile = (farm_data) => {
        // eslint-disable-next-line react/prop-types
        this.props.farmProfile(farm_data, this.props.history)
    }

    
    render() {
        return (
            <div>
                <MarketHeader />
                <Farms {...this.props} selectedFarm={this.handleFarmProfile} />
            </div>
        )
    }
}

Market.propTypes = {
    farmProfile: propTypes.func.isRequired,
    auth: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { farmProfile })(Market)
