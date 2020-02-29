import React, { Component } from 'react'
import './featured_farms.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

//Actions
import {farmProfile} from '../../actions/authActions'

//Import Components
import FeaturedFarmsHeader from './featured_farms_header'
import Farms from './farms_new'

class FeaturedFarms extends Component {
    constructor(props){
        super(props)
        this.state = {
            errors: {}
          }

          this.selectedFarm = this.selectedFarm.bind(this)
    }
    
    selectedFarm = (farm) => {
        console.log(farm._id)
    }

    render() {
        return (
            <div>
                <div>
                    <FeaturedFarmsHeader />
                </div>
                <Farms {...this.props} selectedFarm={this.props.farmProfile} />
            </div>
        )
    }
}

FeaturedFarms.propTypes = {
  farmProfile: propTypes.func.isRequired
    // auth: propTypes.object.isRequired
    // errors: propTypes.object.isRequired
    // featureFarmsFetch: propTypes.func.isRequired
}

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth
    // farms: state.farms
})

export default connect(mapStateToProps, {farmProfile})(FeaturedFarms)

