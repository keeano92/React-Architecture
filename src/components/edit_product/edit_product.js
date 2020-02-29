/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import './edit_product.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import TitleIcon from '@material-ui/icons/Title';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AssignmentIcon from '@material-ui/icons/Assignment';

//Import Actions
import {editProduct} from '../../actions/authActions'

//Import Components
import EditProductHeader from './edit_product_header'


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

class EditProduct extends Component {
    constructor(props){
        super(props)
        this.state = {
            product_id: this.props.location.state.product_details._id,
            product_index: this.props.location.state.product_details.productindex,
            farm_data: {...this.props.location.state.farm_data},
            title: this.props.location.state.product_details.title,
            description: this.props.location.state.product_details.description,
            price: this.props.location.state.product_details.price,
            sku: this.props.location.state.product_details.sku,
            errors:{}
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props) {
            //Persist Errors
            if (this.state.errors !== this.props.errors) {
                this.setState(this.props)
            }
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value})
    }

    onSubmit = e => {
        e.preventDefault()

        const productUpdate = {
            product_id: this.state.product_id,
            product_index: this.state.product_index,
            farm: this.state.farm_data._id,
            title: this.state.title,
            description: this.state.description,
            price: this.state.price,
            sku: this.state.sku
        }

        //Make Action Call to edit product
        this.props.editProduct(productUpdate, this.props.history)
    }


    render() {
        const { errors } = this.state
        return (
            <ThemeProvider theme={theme}>
                <EditProductHeader />
                <div className="container add-produce-container">
                <form noValidate onSubmit={this.onSubmit}>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.title}
                                id="title"
                                type="text"
                                margin="normal"
                                label="Title"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TitleIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.title })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.title}</span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.description}
                                id="description"
                                type="text"
                                margin="normal"
                                label="Description"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SubtitlesIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.description })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.description}</span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.price}
                                id="price"
                                type="number"
                                margin="normal"
                                label="Price"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.price })}
                            />
                            <span style={{ color: theme.palette.error.main }}></span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.sku}
                                id="sku"
                                type="text"
                                margin="normal"
                                label="SKU"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AssignmentIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.sku })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.sku}</span>
                        </div>
                        <div className="signup_button" style={{ paddingLeft: "11.250px" }}>
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
                            >Update</Button>
                        </div>
                    </form>
                </div>
            </ThemeProvider>
        )
    }
}

EditProduct.propTypes = {
    editProduct: propTypes.func.isRequired
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {editProduct})(EditProduct)
