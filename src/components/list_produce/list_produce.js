/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux';
import './list_produce.css'
import propTypes from 'prop-types'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';


//Import Actions
import { produceProfile } from "../../actions/authActions"


//Import Component
import ListProduceHeader from './list_produce_header'

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
        },
        MuiPaper: {
            root: {
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#BCE0FD',
                textAlign: "left",
                width: "365px",
                padding: "2%"
            }

        }
    }
})



class ListProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    handleClick = (product, index) => {
        console.log("Hit handle click with :" + product)
        const product_data = { 
            ...product,
            productIndex: index
        }
        const farm_data = {
            ...this.props.location.state.farm,
            myFarm: this.props.location.state.myFarm
        }

        this.props.produceProfile(product_data, farm_data, this.props.history)
    }

    render() {
        const farmId = this.props.location.state.farm._id
        const listProducts = this.props.auth.produce
            .filter(product => product.farm === farmId)
            .map((product, index) => {
                return <Grid item xs={10} key={product._id} data={product._id} onClick={() => this.handleClick(product, index)}>
                    <Paper>
                        <div className="farm-header">
                            {product.title}
                        </div>
                        <div className="farm-subheader">
                            ${product.price}
                        </div>
                    </Paper>
                </Grid>
            })

        return (
            <ThemeProvider theme={theme}>
                <ListProduceHeader />
                <div className="search-bar">
                    <TextField
                        variant="outlined"
                        fullWidth={true}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="farm-results-container">
                    <div className="list-products-list-container">
                        <Grid container spacing={2}>
                            {listProducts}
                        </Grid>
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}

ListProducts.propTypes = {
    produceProfile: propTypes.func.isRequired,
    auth: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { produceProfile })(ListProducts)

