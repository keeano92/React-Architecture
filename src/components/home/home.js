import React from 'react'
import { Route , withRouter, Redirect} from 'react-router-dom'
import './home.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

//Import Actions
// import { farmProfile } from '../../actions/authActions'

//Import Components
import FeatureFarmsHome from './feature_farms'
import DashboardHeader from '../../components/dashboard/dashboard_header'
import Reviews from './reviews'


//Theme
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

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            farms:[]
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps !== this.props) {
            //Persist Errors
            if (this.state.farms !== this.props.farms) {
                this.setState(this.props)
            }
        }
    }

    featuredFarms = (e) => {
        e.preventDefault()
        this.props.history.push("/featuredFarms")
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <DashboardHeader />
                <div className="dashboard-container">
                    <div className="farms-container">
                        <FeatureFarmsHome user={{featuredFarm:this.featuredFarms, auth: this.props.auth}} />
                    </div>
                    <div className="review-container">
                        <Reviews data={this.state.reviews} />
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}

Home.propTypes = {
    auth: propTypes.object.isRequired,
    history: propTypes.object.isRequired,
    farms: propTypes.array
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(Home)
