import React from 'react'
import './add_farm.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { MenuItem } from '@material-ui/core';
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import BusinessIcon from '@material-ui/icons/Business';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { addFarm } from '../../actions/farmActions'

//Import Components
import AddFarmHeader from './add_farm_header'


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
            root:{
                backgroundColor: 'rgba(255, 255, 255, 1)'
            }
        }
    }
})

const states = [
    {
        value: 'Alabama',
        label: 'AL'
    },
    {
        value: 'Alaska',
        label: 'AK'
    },
    {
        value: 'Arizona',
        label: 'AZ'
    },
    {
        value: 'Arkansas',
        label: 'AR'
    },
    {
        value: 'California',
        label: 'CA'
    },
    {
        value: 'Colorado',
        label: 'CO'
    },
    {
        value: 'Connecticut',
        label: 'CT'
    },
    {
        value: 'Delaware',
        label: 'DE'
    },
    {
        value: 'Florida',
        label: 'FL'
    },
    {
        value: 'Georgia',
        label: 'GA'
    },
    {
        value: 'Hawaii',
        label: 'HI'
    },
    {
        value: 'Idaho',
        label: 'ID'
    },
    {
        value: 'Illinois',
        label: 'IL'
    },
    {
        value: 'Indiana',
        label: 'IN'
    },
    {
        value: 'Iowa',
        label: 'IA'
    },
    {
        value: 'Kansas',
        label: 'KS'
    },
    {
        value: 'Kentucky',
        label: 'KY'
    },
    {
        value: 'Louisiana',
        label: 'LA'
    },
    {
        value: 'Maine',
        label: 'ME'
    },
    {
        value: 'Maryland',
        label: 'MD'
    },
    {
        value: 'Massachusetts',
        label: 'MA'
    },
    {
        value: 'Michigan',
        label: 'MI'
    },
    {
        value: 'Minnesota',
        label: 'MN'
    },
    {
        value: 'Mississippi',
        label: 'MS'
    },
    {
        value: 'Missouri',
        label: 'MO'
    },
    {
        value: 'Montana',
        label: 'MT'
    },
    {
        value: 'Nebraska',
        label: 'NE'
    },
    {
        value: 'Nevada',
        label: 'NE'
    },
    {
        value: 'New Hampshire',
        label: 'NH'
    },
    {
        value: 'New Jersey',
        label: 'NJ'
    },
    {
        value: 'New Mexico',
        label: 'NM'
    },
    {
        value: 'New York',
        label: 'NY'
    },
    {
        value: 'North Carolina',
        label: 'NC'
    },
    {
        value: 'North Dakota',
        label: 'ND'
    },
    {
        value: 'Ohio',
        label: 'OH'
    },
    {
        value: 'Oklahoma',
        label: 'OK'
    },
    {
        value: 'Oregon',
        label: 'OR'
    },
    {
        value: 'Pennsylvania',
        label: 'PA'
    },
    {
        value: 'Rhode Island',
        label: 'RI'
    },
    {
        value: 'South Carolina',
        label: 'SC'
    },
    {
        value: 'South Dakota',
        label: 'SD'
    },
    {
        value: 'Tennessee',
        label: 'TN'
    },
    {
        value: 'Texas',
        label: 'TX'
    },
    {
        value: 'Utah',
        label: 'UT'
    },
    {
        value: 'Vermont',
        label: 'VT'
    },
    {
        value: 'Virginia',
        label: 'VA'
    },
    {
        value: 'Washington',
        label: 'WA'
    },
    {
        value: 'West Virginia',
        label: 'WV'
    },
    {
        value: 'Wisconsin',
        label: 'WI'
    },
    {
        value: 'Wyoming',
        label: 'WY'
    },
]


class AddFarm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            farmer: props.location.state.farmerId,
            farmName: "",
            address: "",
            city: "",
            zipcode: "",
            state: "",
            farmerType: "",
            fromModal: props.location.state.fromModal,
            errors: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            //Persist Errors
            if (this.state.errors !== this.props.errors) {
                this.setState(this.props)
            }
            //Perist Form Info
            //Run console test to see prevProps vs Props on page refrsh against errors
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value })

    }

    handleState = e => {
        this.setState({state: e.target.value})
    }

    handleType = e => {
        this.setState({farmerType: e.target.value})
    }

    onSubmit = e => {
        e.preventDefault()

        const newFarm = {
            farmer: this.state.farmer,
            farmName: this.state.farmName,
            address: this.state.address,
            city: this.state.city,
            zipcode: this.state.zipcode,
            state: this.state.state,
            farmerType: this.state.farmerType
        }

        // eslint-disable-next-line react/prop-types
        this.props.addFarm(newFarm, this.state.fromModal, this.props.history)
    }

    render() {
        const { errors } = this.state
        return (
            <ThemeProvider theme={theme}>
                <AddFarmHeader />
                <div className="container">
                    <form noValidate onSubmit={this.onSubmit}>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.farmName}
                                id="farmName"
                                type="text"
                                margin="normal"
                                label="My Farm Name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.farmName })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.farmName}</span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.address}
                                id="address"
                                type="text"
                                margin="normal"
                                label="Address"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.address })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.address}</span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.city}
                                id="city"
                                type="text"
                                margin="normal"
                                label="City"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationCityIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.city })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.city}</span>
                        </div>
                        <div>
                            <TextField
                                required
                                onChange={this.onChange}
                                value={this.state.zipcode}
                                id="zipcode"
                                type="text"
                                margin="normal"
                                label="Zipcode"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationCityIcon />
                                        </InputAdornment>
                                    )
                                }}
                                className={classnames("signup_textfield", { invalid: errors.zipcode })}
                            />
                            <span style={{ color: theme.palette.error.main }}>{errors.zipcode}</span>
                        </div>
                        <div>
                            <div>
                                <TextField
                                    required
                                    select
                                    onChange={this.handleState}
                                    id="state"
                                    margin="normal"
                                    label="State"
                                    value={this.state.state}
                                    helperText="Select State"
                                    className={classnames("signup_textfield", {})}
                                >
                                    {states.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span style={{ color: theme.palette.error.main }}></span>
                            </div>
                        </div>
                        <div>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">What kind of farmer are you?</FormLabel>
                                <RadioGroup aria-label="position" name="position" value={this.state.farmerType} onChange={this.handleType} row>
                                    <FormControlLabel
                                        value="Full Time"
                                        control={<Radio color="primary" />}
                                        label="Full Time"
                                        labelPlacement="end"
                                    />
                                    <FormControlLabel
                                        value="Part Time"
                                        control={<Radio color="primary" />}
                                        label="Part Time"
                                        labelPlacement="end"
                                    />
                                </RadioGroup>
                            </FormControl>
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
                            >CONTINUE</Button>
                        </div>
                    </form>
                </div>
            </ThemeProvider>
        )
    }
}

AddFarm.propTypes = {
    addFarm: propTypes.func.isRequired,
    errors: propTypes.object.isRequired,
    location: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    errors: state.errors
})

export default connect(mapStateToProps, { addFarm })(withRouter(AddFarm))

